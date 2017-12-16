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
const merapi_1 = require("merapi");
class ApiController extends merapi_1.Component {
    constructor(scrapperManager) {
        super();
        this.scrapperManager = scrapperManager;
    }
    getFlightDetails(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const flightNumber = request.query.flightNumber;
            const result = yield this.scrapperManager.flightDetails(flightNumber);
            response.status(200).json(result);
        });
    }
}
exports.default = ApiController;
//# sourceMappingURL=api_controller.js.map