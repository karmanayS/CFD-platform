import { WebSocketServer } from "ws";
import { createClient } from "redis";

const redis = createClient();

async function main() {
    const wss = new WebSocketServer({port : 8080});
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

    wss.on("error",(err) => {
        console.log(err)
        process.exit(1)
    })

    console.log("WS server running on port 8080")
}

main().catch((err) => {
    console.log("WS server startup failed: ",err)
    process.exit(1)
})