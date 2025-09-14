import { createClient } from "redis";

export const redis = createClient();

async function redisConnect() {
    try {await redis.connect()}
    catch(err) {
        return console.log(err);
    }
}

redisConnect();