import { IRedisRepo } from "interfaces/repos";
import * as Redis from "ioredis";
import { Component, IConfigReader } from "merapi";

export default class RedisRepo extends Component implements IRedisRepo {
    private redisClient: Redis.Redis;
    private redisUrl: string;

    constructor(protected config: IConfigReader) {
        super();
        this.redisUrl = config.default("redis.url", "");
    }

    public setupRedis(redisUrl: string) {
        return new Redis(redisUrl);
    }

    public async initialize() {
        this.redisClient = this.setupRedis(this.redisUrl);
    }

    public get(key: string, hash?: string): Promise<string> {
        if (hash) {
            return new Promise((resolve, reject) => {
                this.redisClient.hget(key, hash, (err: Error, result: string) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                this.redisClient.get(key, (err: Error, result: string) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        }
    }

    public setex(key: string, data: string, ttl: number): Promise<string> {
        return new Promise((resolve, reject) => {
            this.redisClient.setex(key, ttl, data, (err: Error, result: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}
