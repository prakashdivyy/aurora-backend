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
const merapi_1 = require("merapi");
const request = require("request-promise");
class ScrapperManager extends merapi_1.Component {
    constructor() {
        super();
    }
    flightDetails(flightNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = flightNumber.split(" ").join("").split("0").join("");
                const content = yield request.get("https://www.google.com/search?q=" + query);
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