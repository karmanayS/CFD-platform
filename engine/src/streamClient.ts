import { createClient } from "redis";
import "dotenv/config"

export const stream = createClient({
    url: process.env.REDIS_URL ?? "redis://redis:6379"
});

export async function connectStreamClient() {
    try {
        await stream.connect()
        console.log("connected to stream client successfully");
    }
    catch(err) {
        console.log("Error while connecting to stream client , exiting process...");
        process.exit(1)
    }
}