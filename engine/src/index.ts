import { createClient } from "redis";
import { openOrders, PRICES, supportedAssets, users } from "./db";
import { getUsdBalance } from "./functions/getUsdBalance";
import { stream } from "./redisClient";
import { createOrder } from "./functions/openOrder";
import { closeOrder } from "./functions/closeOrder";
import liquidate from "./functions/liquidate";
import { OpenOrders } from "./types";

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
            if(openOrders.length > 0) liquidate(openOrders,PRICES,users);
        })

        while (true) {
            const data = await stream.xRead({
                key : "EX-EN",
                id : "$"
            }, {
                BLOCK : 0
            })

            if (!data) return console.log("error data doesnt exist");
            const message = data[0].messages[0].message;
            const payload = JSON.parse(message.payload)
            if (!payload) return console.log("error payload doesnt exist");
            
            if(message.type === "openOrder") {
                const response = createOrder(payload,users,openOrders,PRICES);  
                await stream.xAdd("EN-EX","*",{
                    randomId: message.randomId,
                    type : "orderId",
                    payload: JSON.stringify({
                        orderId: response
                    })
                })
                console.log(openOrders);
            }
            
            if(message.type === "closeOrder") {
                //console.log(payload.userId,payload.orderId);
                const status = closeOrder(payload.userId);
                await stream.xAdd("EN-EX","*",{
                    randomId: message.randomId,
                    type : "closeOrderStatus",
                    payload : JSON.stringify({
                        status
                    })
                });
                console.log(openOrders);
            }

            if(message.type === "usdBalance") {
                const usdBalance = getUsdBalance(payload.userId,users);
                await stream.xAdd("EN-EX","*",{
                    randomId: message.randomId,
                    type: "usdBalance",
                    payload : JSON.stringify({
                        usdBalance
                    })
                })
            }

            if(message.type === "supportedAssets") {
                await stream.xAdd("EN-EX","*",{
                    randomId: message.randomId,
                    type: "supportedAssets",
                    payload: JSON.stringify({
                        supportedAssets
                    })
                })
            }

            if(message.type === "getOpenOrders") {
                const orders:OpenOrders[] = [];
                openOrders.map((o) => {
                    if (o.userId === payload.userId) {
                        orders.push(o);
                    }
                })
                console.log(orders);
                await stream.xAdd("EN-EX", "*" ,{
                    randomId: message.randomId,
                    type : "openOrders",
                    payload : JSON.stringify({
                        openOrders: orders
                    })
                })
            }

        }
    } catch(err) {
        return console.log(err)
    }    
}

main();