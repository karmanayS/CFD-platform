import { createClient } from "redis";

export const stream = createClient();

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