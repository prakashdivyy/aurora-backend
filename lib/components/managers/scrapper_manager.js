"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const _ = require("lodash");
const merapi_1 = require("merapi");
const request = require("request-promise");
class ScrapperManager extends merapi_1.Component {
    constructor() {
        super();
    }
    flightDetails(flightNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const code = flightNumber.split(" ");
                const page = code[0].toLowerCase() + parseInt(code[1], 10);
                const content = yield request.get("https://utiket.com/en/flights/schedule/" + page + ".html");
                const $ = cheerio.load(content);
                const flightDetails = $(".content-content h1").text().split(" Flight number ");
                if (flightDetails.length === 1) {
                    return {
                        success: false,
                    };
                }
                const route = $(".content-content h2").text().split("From ")[1].split(" to ");
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
                    city: route[0],
                    country: cheerio.load(rows[3][3])(":root").text().split("Country")[1],
                    time: rows[0][1].split("</label>")[1],
                };
                const searchResult = {
                    airline: flightDetails[0],
                    destination,
                    flightNumber,
                    origin,
                };
                return {
                    data: searchResult,
                    success: true,
                };
            }
            catch (e) {
                return {
                    success: false,
                };
            }
        });
    }
}
exports.default = ScrapperManager;
//# sourceMappingURL=scrapper_manager.js.map