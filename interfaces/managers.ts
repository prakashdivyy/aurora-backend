import { JsonObject } from "merapi";

export interface IScrapperManager {
    flightDetails(flightNumber: string): Promise<JsonObject>;
}
