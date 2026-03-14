import express from "express";
import { redis } from "../redisClient";
import { authMiddlware } from "../middlewares/authMiddleware";

const assetRouter = express.Router();

assetRouter.get("/",async(req,res) => {
    const randomId = crypto.randomUUID()   
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

        const allMessages = await redis.xRead({
            key: "EN-EX",
            id: lastId
        }, {
            BLOCK:0
        })

        if (!allMessages) return res.json({
            success: false,
            message: "Did not receive supported assets from engine"
        })
        //@ts-ignore
        const message = allMessages[0].messages.find(entry => entry.message.randomId === randomId)
        if (!message) return res.json({
            success: false,
            message : "Couldn't fetch supported assets"
        })
        return res.json({
            success : true,
            supportedAssets: JSON.parse(message.message.payload).supportedAssets
        })
    } catch (err) {
        console.log(err)
        return res.json({success:false,message: "Error while fetching supported assets"});
    }
        
})

export default assetRouter;