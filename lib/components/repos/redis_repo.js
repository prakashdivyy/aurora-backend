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
const Redis = require("ioredis");
const merapi_1 = require("merapi");
class RedisRepo extends merapi_1.Component {
    constructor(config) {
        super();
        this.config = config;
        this.redisUrl = config.default("redis.url", "");
    }
    setupRedis(redisUrl) {
        return new Redis(redisUrl);
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.redisClient = this.setupRedis(this.redisUrl);
        });
    }
    get(key, hash) {
        if (hash) {
            return new Promise((resolve, reject) => {
                this.redisClient.hget(key, hash, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        }
        else {
            return new Promise((resolve, reject) => {
                this.redisClient.get(key, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        }
    }
    setex(key, data, ttl) {
        return new Promise((resolve, reject) => {
            this.redisClient.setex(key, ttl, data, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.default = RedisRepo;
//# sourceMappingURL=redis_repo.js.map