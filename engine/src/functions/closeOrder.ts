import { createClient } from "redis";
import { OpenOrders, Prices, User } from "../types";

const redis = createClient();

redis.connect()
.then()
.catch((err) => console.log(err));

export async function readCloseOrders(openOrders:OpenOrders[],users:User[],prices:Prices[]) {
    const data = await redis.xRead({
        key : "closeOrder",
        id: "$"
    }, {
        BLOCK: 0
    })
    if (data) {
        const closeOrderId = data[0].messages[0].message.orderId;
        const userId = data[0].messages[0].message.userId;
        try {    
            for (let i=0;i<openOrders.length;i++) {
                if (openOrders[i].orderId === closeOrderId) {
                    for (let j =0;j<users.length;j++) {
                        if (users[j].userId === userId) {
                             openOrders[i].type === "long" ? users[j].balance.amount += (openOrders[i].qty * ((prices.find(e => e.asset === openOrders[i].asset)?.bidPrice !)/((openOrders[i].asset === "BTC") ? 10000 : 1000000))) * 100 : null

                            //  users[j].balance.amount += users[j].balance.locked - (openOrders[i].qty * ((prices.find(e => e.asset === openOrders[i].asset)?.askPrice !)/((openOrders[i].asset === "BTC") ? 10000 : 1000000))) * 100
                        }
                    }
                }
            }
        } catch (err) {return console.log(err)}    
    }
}