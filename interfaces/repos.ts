import { JsonObject } from "merapi";

export interface IRedisRepo {
    get(key: string, hash?: string): Promise<string>;
    setex(key: string, value: string | JsonObject, ttl: number): Promise<string>;
}
