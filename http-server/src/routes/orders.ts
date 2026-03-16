import express from "express";
import { redis } from "../redisClient";
import { authMiddlware } from "../middlewares/authMiddleware";
import { streamReader } from "../helpers/streamReader";

export const orderRouter = express.Router();

orderRouter.get("/openOrders",authMiddlware,async(req,res) => {
    const userId = req.userId;
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
            type : "getOpenOrders",
            payload : JSON.stringify({
                userId
            })
        })
        const message = await streamReader(lastId,randomId)
        return res.json({
            success : true,
            openOrders: JSON.parse(message.message.payload).openOrders
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({success: false,message : "Error while fetching open orders"})
    }
       
})