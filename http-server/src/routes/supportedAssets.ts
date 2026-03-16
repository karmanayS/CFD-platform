import express from "express";
import { redis } from "../redisClient";
import { streamReader } from "../helpers/streamReader";
import { authMiddleware } from "../middlewares/authMiddleware";

const assetRouter = express.Router();

assetRouter.get("/",authMiddleware,async(req,res) => {
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
        const message = await streamReader(lastId,randomId)
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