import { createClient } from "redis";

const redis = createClient()

redis.connect().then(() => {
    console.log("inside readStream file")
}).catch((err) => {
    console.log(err)
})

export async function readStream() {
    try {
        const newOrder = await redis.xRead({
            key: 'createOrder',
            id : '$'
        }, {
            BLOCK: 0
        })
        return newOrder[0].messages;
    } catch (error) {
        return console.log(error);
    }
}