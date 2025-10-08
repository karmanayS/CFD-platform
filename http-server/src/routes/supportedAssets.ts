import express from "express";
import { redis } from "../redisClient";

const assetRouter = express.Router();

assetRouter.get("/",async(req,res) => {
    const randomId = crypto.randomUUID()
    
    while (true) {    
        try {
            const response = await redis.xRevRange('EN-EX', '+', '-', {COUNT: 1});
            let lastId;
            if (response.length === 0) {
                lastId = "0"
            } else {
                lastId = response[0].id
            }
            
            await redis.xAdd("EX-EN","*",{
                randomId,
                type : "supportedAssets",
                payload: JSON.stringify({
                    message: "null"
                })
            })

            const data = await redis.xRead({
                key: "EN-EX",
                id: lastId
            }, {
                BLOCK: 0 
            })
            if (data) {
                //@ts-ignore
                const message = data[0].messages[0].message;
                if(message.randomId !== randomId) continue;
                const payload = JSON.parse(message.payload);
                if (message.type == "supportedAssets") return res.json({supportedAssets: payload.supportedAssets});
            } else throw new Error("no data received")
        } catch (err) {
            return res.json({message: err});
        }
    }    
})

export default assetRouter;