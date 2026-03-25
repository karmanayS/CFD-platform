import { createClient } from "redis";
import "dotenv/config"

export const redis = createClient({
    url: process.env.REDIS_URL ?? 'redis://redis:6379'
});

// interface Order {
//     asset:string,
//     type: "long" | "short",
//     qty:number,
//     leverage:number,
//     userId:string
// }

// class RedisManager {
//     private static instance:RedisManager;
//     private redisClient:RedisClientType = createClient();

//     private constructor() {
//         this.redisClient.connect();
//     }

//     static getInstance() {
//         if(!this.instance) {
//             this.instance = new RedisManager;
//         }
//         return this.instance;
//     }

//     add(randomId:string,payload:Order,type:string) {
//         this.redisClient.xAdd("EX-EN","*",{
//             randomId,
//             type,
//             payload: JSON.stringify(payload)
//         })
//     }

//     read() {

//     }
// } 

// ==> THE CLASS MAKES THE EDITOR LAG IN ALL THE DEVICES NOT JUST MINE . WHY ?