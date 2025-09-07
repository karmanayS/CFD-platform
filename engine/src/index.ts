import { createClient } from "redis";
import { openOrders, PRICES, users } from "./db";
import { readStream } from "./functions/readStream";

const redis = createClient();
const redisStream = createClient();

async function main() {
    try {
        await redis.connect();
        await redisStream.connect();

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
            for (let i = 0;i<users.length;i++) {
                if (users[i].userId === newOrder.userId) {
                    newOrder.type === "long" ? users[i].balance.amount -= newOrder.amount : users[i].balance.locked += newOrder.amount
                    break 
                }
            }
            const orderId = crypto.randomUUID();
            openOrders.push({
                orderId,
                asset : newOrder.asset,
                type : newOrder.type,
                qty : newOrder.qty,
                amount : newOrder.amount
            })
            await redisStream.xAdd('openOrderId', '*',{
                orderId
            })
        }
    } catch(err) {
        return console.log(err)
    }    
}

main();