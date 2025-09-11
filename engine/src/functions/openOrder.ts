import { createClient } from "redis";
import { OpenOrders, Prices, User } from "../types";

const redis = createClient()

redis.connect().then(() => {
    console.log("inside readStream file")
}).catch((err) => {
    console.log(err)
})

export async function readStream(users:User[],openOrders:OpenOrders[],prices:Prices[]) {
    try {
        const newOrder = await redis.xRead({
            key: 'createOrder',
            id : '$'
        }, {
            BLOCK: 0
        })

        if (newOrder) {
            let orderAmount:number;
            
            newOrder.type === "long" ? orderAmount = (newOrder.qty * ((prices.find(e => e.asset === newOrder.asset)?.askPrice !) / ((newOrder.asset === "BTC") ? 10000 : 1000000))) :
            
            orderAmount = (newOrder.qty * ((prices.find(e => e.asset === newOrder.asset)?.bidPrice !) / ((newOrder.asset === "BTC") ? 10000 : 1000000)));

            for (let i = 0;i<users.length;i++) {
                if (users[i].userId === newOrder.userId) {
                    newOrder.type === "long" ? users[i].balance.amount -= orderAmount * 100 : 
                    users[i].balance.locked += orderAmount * 100 
                    break 
                }
            }
            const orderId = crypto.randomUUID();
            openOrders.push({
                orderId,
                asset : newOrder.asset,
                type : newOrder.type,
                qty : newOrder.qty,
                amount : orderAmount
            })
            await redis.xAdd('openOrderId', '*',{
                orderId
            })
        } else throw new Error("cant get new order from stram")

    } catch (error) {
        return console.log(error);
    }
}