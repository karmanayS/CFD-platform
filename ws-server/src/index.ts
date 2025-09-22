import { WebSocketServer } from "ws";
import { createClient } from "redis";

const wss = new WebSocketServer({port : 8080});
const redis = createClient();

async function main() {    
    try {    
        await redis.connect();

        wss.on("connection" ,async(ws) => {
            ws.on("error",console.error);
            await redis.subscribe("TICKS",(message,channel) => {
                ws.send(message);
            })        
        })
    } catch (err) {
        return console.log(err);
    }    
}

main()