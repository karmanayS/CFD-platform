import { WebSocketServer } from "ws";
import { createClient } from "redis";

const wss = new WebSocketServer({port : 8080});
const redis = createClient();

async function main() {
    try {
        await redis.connect();

        await redis.subscribe("TICKS",(message) => {
            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send(message);
                }
            });
        })

        wss.on("connection",(ws) => {
            ws.on("error",console.error);
        })

        console.log("WS server running on port 8080")
    } catch (err) {
        console.log(err);
        return
    }
}

main()