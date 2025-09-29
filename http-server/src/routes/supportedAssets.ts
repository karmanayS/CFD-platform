import express from "express";
import { redis } from "../redisClient";

const assetRouter = express.Router();

assetRouter.get("/",async(req,res) => {
    try {
        await redis.xAdd("EX-EN","*",{
            type : "supportedAssets",
            payload: JSON.stringify({
                message: "null"
            })
        })
        
        const data = await redis.xRead({
            key: "EN-EX",
            id: "$"
        }, {
            BLOCK: 5000, COUNT: 1 
        })
        if (data) {
            //@ts-ignore
            const message = data[0].messages[0].message;
            const payload = JSON.parse(message.payload);
            if (message.type == "supportedAssets") return res.json({supportedAssets: payload.supportedAssets});
        } else throw new Error("no data received")
    } catch (err) {
        return res.json({message: err});
    }
})

export default assetRouter;