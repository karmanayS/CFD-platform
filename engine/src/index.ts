import { createClient } from "redis";
import { openOrders, PRICES, supportedAssets, users } from "./db";
import { getUsdBalance } from "./functions/getUsdBalance";
import { stream } from "./streamClient";
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

        const response = await stream.xRevRange('EN-EX', '+', '-', {COUNT: 1});
        let lastId:string;
        if (response.length === 0) {
            lastId = "0"
        } else {
            lastId = response[0].id
        }
        while (true) {
            const data = await stream.xRead({
                key : "EX-EN",
                id : lastId
            }, {
                BLOCK : 0
            })

            if (!data) return console.log("error data doesnt exist");
            
            for (const element of data[0].messages) {
                lastId = element.id
                const message = element.message
                const payload = JSON.parse(message.payload)
                if (!payload) return console.log("error payload doesnt exist");
                
                if (message.type === "signUp") {
                    const existingUser = users.find(u => u.userId === payload.email)
                    if (existingUser) {
                        await stream.xAdd("EN-EX", "*", {
                            randomId : message.randomId,
                            success: "false"
                        })    
                        continue
                    }
                    users.push({
                        userId: payload.email,
                        balance: {
                            amount: 500000,
                            margin: 0
                        }
                    })
                    await stream.xAdd("EN-EX", "*", {
                        randomId : message.randomId,
                        success: "true"
                    })
                }

                if (message.type === "signIn") {
                    const existingUser = users.find((user) => user.userId === payload.email)
                    let success = "true";
                    if (!existingUser) {
                        success = "false"
                    }
                    await stream.xAdd("EN-EX", "*" ,{
                        randomId : message.randomId,
                        success
                    })    
                }
                
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
                    const status = closeOrder(payload.orderId,openOrders,users);
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
                        payload : JSON.stringify({
                            usdBalance
                        })
                    })
                }

                if(message.type === "supportedAssets") {
                    await stream.xAdd("EN-EX","*",{
                        randomId: message.randomId,
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
                    await stream.xAdd("EN-EX", "*" ,{
                        randomId: message.randomId,
                        payload : JSON.stringify({
                            openOrders: orders
                        })
                    })
                }
            }    
        }
    } catch(err) {
        return console.log(err)
    }    
}

main();