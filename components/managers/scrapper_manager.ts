import * as cheerio from "cheerio";
import { IScrapperManager } from "interfaces/managers";
import { IRedisRepo } from "interfaces/repos";
import * as _ from "lodash";
import { Component, JsonObject } from "merapi";
import * as request from "request-promise";

export default class ScrapperManager extends Component implements IScrapperManager {
    constructor(private redisRepo: IRedisRepo) {
        super();
    }

    public async flightDetails(flightNumber: string): Promise<any> {
        try {
            const code = flightNumber.split(" ");
            const page = code[0].toLowerCase() + parseInt(code[1], 10);
            const inRedis = await this.redisRepo.get(page);
            if (inRedis) {
                return JSON.parse(inRedis);
            } else {
                const content = await request.get("https://utiket.com/en/flights/schedule/" + page + ".html");
                const $ = cheerio.load(content);
                const flightDetails = $(".content-content h1").text().split(" Flight number ");

                if (flightDetails.length === 1) {
                    return {
                        success: false,
                    };
                }

                const route = $(".content-content h2").text().split("From ")[1].split(" to ");
                // tslint:disable-next-line:max-line-length
                const rows = _.map($("#flight-number-box").html().replace(/\t/g, "").replace(/\n/g, "").split("<hr>"), (e) => {
                    const d = e.split("<br>");
                    return _.map(d, (x) => {
                        return x.trim();
                    });
                });

                const origin = {
                    airport: cheerio.load(rows[2][1])(":root").text().split("Airport name")[1],
                    airportCode: cheerio.load(rows[2][2])(":root").text().split("IATA Airport code ")[1],
                    city: route[0],
                    country: cheerio.load(rows[2][3])(":root").text().split("Country")[1],
                    time: rows[0][0].split("</label>")[1],
                };

                const destination = {
                    airport: cheerio.load(rows[3][1])(":root").text().split("Airport name")[1],
                    airportCode: cheerio.load(rows[3][2])(":root").text().split("IATA Airport code ")[1],
                    city: route[1],
                    country: cheerio.load(rows[3][3])(":root").text().split("Country")[1],
                    time: rows[0][1].split("</label>")[1],
                };

                const searchResult = {
                    airline: flightDetails[0],
                    destination,
                    flightNumber,
                    origin,
                };

                const result = {
                    data: searchResult,
                    success: true,
                };

                await this.redisRepo.setex(page, JSON.stringify(result), 3600);
                return result;
            }
        } catch (e) {
            return {
                success: false,
            };
        }
    }
}
