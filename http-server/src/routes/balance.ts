import express from "express";
import { redis } from "../redisClient";
import { authMiddlware } from "../middlewares/authMiddleware";
import { streamReader } from "../helpers/streamReader";

export const balanceRouter = express.Router();

balanceRouter.get("/usd",authMiddlware,async(req,res) => {
    const userId = req.userId;
    const randomId = crypto.randomUUID();
        
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
            type: "usdBalance",
            payload : JSON.stringify({
                userId
            })
        })
        const message = await streamReader(lastId,randomId)
        return res.json({
            success : true,
            usdBalance: JSON.parse(message.message.payload).usdBalance
        })    
    } catch (err) {
        console.log(err)
        return res.json({success:false,message : "error while fetching usd balance"})
    } 
    
})