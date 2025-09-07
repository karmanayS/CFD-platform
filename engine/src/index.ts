import { createClient } from "redis";
import { PRICES } from "./db";
import { readStream } from "./functions/readStream";

const redis = createClient();

async function main() {
    try {
        await redis.connect();

        await redis.subscribe("TICKS",(message,channel) => {
            const data = JSON.parse(message);
            const arr = data.price_updates;
            arr.map((e:{asset:string,price:number,decimal:number}) => {
                for (let i = 0;i<PRICES.length;i++) {
                    if (e.asset === PRICES[i].asset) {
                        PRICES[i].bidPrice = e.price - (0.01*e.price);
                        PRICES[i].askPrice = e.price + (0.01*e.price);
                        break
                    }
                }
            })
        })

        while (true) {
            const newOrder = await readStream();
            console.log(newOrder)
        }
    } catch(err) {
        return console.log(err)
    }    
}

main();