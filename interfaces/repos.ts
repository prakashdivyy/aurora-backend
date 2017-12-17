import { JsonObject } from "merapi";

export interface IRedisRepo {
    get(key: string, hash?: string): Promise<string>;
    delete(key: string, hash?: string): Promise<number>;
    setex(key: string, value: string | JsonObject, ttl: number): Promise<string>;
}
