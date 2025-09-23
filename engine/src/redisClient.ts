import { createClient } from "redis";

export const stream = createClient();

async function connectClient() {
    try {
        await stream.connect()
        console.log("connected to redis client");
    }
    catch(err) {
        return console.log(err);
    }
}
connectClient();