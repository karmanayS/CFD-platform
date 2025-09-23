import express from "express";
import { redis } from "../redisClient";

export const orderRouter = express.Router();

orderRouter.get("/openOrders", async(req,res) => {
    const {userId} = req.body;
    try {
        await redis.xAdd("EX-EN","*",{
            type : "getOpenOrders",
            payload : JSON.stringify({
                userId
            })
        })
        const data = await redis.xRead({
            key: "EN-EX",
            id : "$"
        }, {
            BLOCK : 0
        })
        if(data) {
            //@ts-ignore
            const message = data[0].messages[0].message;
            const payload = JSON.parse(message.payload);
            const openOrders = payload.openOrders;
            //@ts-ignore
            if (message.type === "openOrders") return res.json({openOrders});
        } else throw new Error("didnt receive data from engine");
    } catch(err) {
        console.log(err);
        return res.status(500).json({message : "Error mid operation"})
    }
})