import * as cheerio from "cheerio";
import { IScrapperManager } from "interfaces/managers";
import { Component, JsonObject } from "merapi";
import * as request from "request-promise";

export default class ScrapperManager extends Component implements IScrapperManager {
    constructor() {
        super();
    }

    public async flightDetails(flightNumber: string): Promise<JsonObject> {
        try {
            const query = flightNumber.split(" ").join("").split("0").join("");
            const content = await request.get("https://www.google.com/search?q=" + query);

            const $ = cheerio.load(content);
            const flightDetails = $("#ires tbody").parent().parent().children().html().split(" Flight ");
            const result = $("#ires tbody").toArray()[0].children;

            const originCode = result[1].children[1].children[0].data;
            const originTime = result[1].children[2].children[0].data;
            const originCity = result[2].children[1].children[0].data;
            const originTerminal = result[1].children[4].children[0].data.split("Terminal ")[1];

            const destinationCode = result[4].children[1].children[0].data;
            const destinationTime = result[4].children[2].children[0].data;
            const destinationCity = result[5].children[1].children[0].data;
            const destinationTerminal = result[4].children[4].children[0].data.split("Terminal ")[1];

            const origin = {
                city: originCity ? originCity : "-",
                code: originCode ? originCode : "-",
                terminal: originTerminal ? originTerminal : "-",
                time: originTime ? originTime : "-",
            };

            const destination = {
                city: destinationCity ? destinationCity : "-",
                code: destinationCode ? destinationCode : "-",
                terminal: destinationTerminal ? destinationTerminal : "-",
                time: destinationTime ? destinationTime : "-",
            };

            const flightCode = query.split(flightDetails[1])[0].toUpperCase() + " " + flightDetails[1];

            const searchResult = {
                airlane: flightDetails[0],
                destination,
                flightCode,
                origin,
            };

            return {
                data: searchResult,
                success: true,
            };
        } catch (e) {
            return {
                success: false,
            };
        }
    }
}
