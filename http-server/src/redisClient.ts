import { createClient, RedisClientType } from "redis";

// export const redis = createClient();

// async function redisConnect() {
//     try {await redis.connect()}
//     catch(err) {
//         return console.log(err);
//     }
// }

class RedisManager {
    private static instance:RedisManager;
    private redisClient:RedisClientType = createClient();

    private constructor() {
        this.redisClient.connect();
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new RedisManager;
        }
        return this.instance;
    }

    add(randomId,payload) {
        this.redisClient.xAdd("EX-EN","*",{

        });
    }



}


const redis = RedisManager.getInstance();


//redisConnect();