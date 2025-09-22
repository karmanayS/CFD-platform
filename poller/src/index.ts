import { createClient } from "redis";
import WebSocket from "ws";

interface Ticks {
    price_updates : {asset:string,price:number,decimal:number}[]
};

const backpackSocket = new WebSocket("wss://ws.backpack.exchange");
const redis = createClient();

async function main() {
    try {await redis.connect();}
    catch (err) { return console.log(err)};

    backpackSocket.onopen = () => {
        console.log("connected to backpack server...");
        backpackSocket.send(JSON.stringify({
            "method": "SUBSCRIBE",
            "params": ["bookTicker.SOL_USDC"]
        }))
        backpackSocket.send(JSON.stringify({
            "method": "SUBSCRIBE",
            "params": ["bookTicker.BTC_USDC"]
        }))
        // backpackSocket.send(JSON.stringify({
        //     "method": "SUBSCRIBE",
        //     "params": ["bookTicker.ETH_USDC"]
        // }))
    }

    const ticks:Ticks = {
        price_updates: [{
            asset : "BTC",
            price: 0,
            decimal: 4
        }, {
            asset : "SOL",
            price: 0,
            decimal: 6
        }]
    };

    backpackSocket.onmessage = (event) => {
        const data = JSON.parse(event.data.toString())
        if(data.data.s === "BTC_USDC") { 
            for (let i = 0;i<ticks.price_updates.length;i++) {
                if (ticks.price_updates[i].asset === "BTC") {
                    ticks.price_updates[i].price = parseFloat(data.data.a) * 10000
                    break
                }
            }
        } else if (data.data.s === "SOL_USDC") {
            for (let i = 0;i<ticks.price_updates.length;i++) {
                if (ticks.price_updates[i].asset === "SOL") {
                    ticks.price_updates[i].price = parseFloat(data.data.a) * 1000000
                    break
                }
            }
        }
        redis.publish("TICKS",JSON.stringify(ticks))
    }

    backpackSocket.onclose = (event) => {
        console.log("connection to backpack server closed",event);
    }

    backpackSocket.ping = () => {
        backpackSocket.pong()
    }
}    

main();