import { createClient } from "redis";

export const stream = createClient();

async function connectClient() {
    try {await stream.connect()}
    catch(err) {
        return console.log(err);
    }
}
connectClient();