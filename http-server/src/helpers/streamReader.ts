import { redis } from "../redisClient";

export const streamReader = async(lastId:string,randomId:string) => {
    while (true) {    
        const allMessages = await redis.xRead({
            key: "EN-EX",
            id: lastId
        }, {
            BLOCK:5000
        })
        if (!allMessages) throw new Error("couldnt fetch stream entries")
        let message;
        //@ts-ignore
        for (const entry of allMessages[0].messages) {
            if(entry.message.randomId === randomId) {
                message = entry
                break
            }
            lastId = entry.id
        }
        if (!message) continue
        return message
    }    
}