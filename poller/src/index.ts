import { createClient } from "redis";
import WebSocket from "ws";

interface Ticks {
    price_updates : {asset:string,price:number,decimal:number}[]
};

const redis = createClient();

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

function connectToBackpack() {
    const backpackSocket = new WebSocket("wss://ws.backpack.exchange");

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

    backpackSocket.onmessage = async(event) => {
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
        await redis.publish("TICKS",JSON.stringify(ticks))
    }

    backpackSocket.onclose = () => {
        console.log("connection to backpack server closed, reconnecting in 3s...");
        setTimeout(connectToBackpack, 3000);
    }

    backpackSocket.onerror = (err) => {
        console.log("backpack ws error:", err);
        backpackSocket.close();
    }
}

async function main() {
    await redis.connect()
    connectToBackpack();
}

main().catch(err => {
    console.log(err)
    process.exit(1)
});