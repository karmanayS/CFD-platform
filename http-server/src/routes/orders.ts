import express from "express";
import { redis } from "../redisClient";
import { authMiddlware } from "../middlewares/authMiddleware";

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
        
        const allMessages = await redis.xRead({
            key: "EN-EX",
            id: lastId
        }, {
            BLOCK:0
        })
        if (!allMessages) return res.json({
            success: false,
            message: "Did not receive open orders from engine"
        })
        //@ts-ignore
        const message = allMessages[0].messages.find((entry) => {
            if (entry.message.randomId === randomId) {      
                return entry.message
            }
        })
        if (!message) return res.json({
            success: false,
            message : "Couldn't fetch open orders"
        })
        return res.json({
            success : true,
            openOrders: JSON.parse(message.message.payload).openOrders
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({message : "Error while fething open orders"})
    }
       
})