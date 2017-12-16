import * as express from "express";
import { IScrapperManager } from "interfaces/managers";
import { Component } from "merapi";

export default class ApiController extends Component {
    constructor(private scrapperManager: IScrapperManager) {
        super();
    }

    public async getFlightDetails(request: express.Request, response: express.Response, next?: express.NextFunction) {
        const flightNumber = request.query.flightNumber;
        const result = await this.scrapperManager.flightDetails(flightNumber);
        response.status(200).json(result);
    }
}
