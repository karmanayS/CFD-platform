import express from "express";
import { redis } from "../redisClient";

const tradeRouter = express.Router();

tradeRouter.post("/create",async(req,res) => {
    const {asset,type,qty,amount,userId} = req.body;
    try {    
        await redis.xAdd('EX-EN', '*', {
            type: "openOrder",
            payload :JSON.stringify({
                asset,
                type,
                qty,
                userId
            })
        })    
        const data = await redis.xRead({
            key: "EN-EX",
            id : "$"
        }, {
            BLOCK : 0
        })
        
        if (data) {
            //@ts-ignore
            const message = data[0].messages[0].message;
            //@ts-ignore
            if (message.type === "orderId") return res.json({orderId : JSON.parse(message.payload).orderId});
        } else throw new Error("didnt receive orderId from the redis stream");   
    } catch (err) {
        console.log(err);
        return res.json("error while creating oder")
    }   
    
})

tradeRouter.post("/close",async(req,res) => {
    const {orderId,userId} = req.body;
    try {    
        await redis.xAdd("EX-EN",'*',{
            type: "closeOrder",
            payload: JSON.stringify({
                userId,
                orderId
            })
        })
        const data = await redis.xRead({
            key: "EN-EX",
            id : "$"
        }, {
            BLOCK: 0
        })
        if (data) {
            //@ts-ignore
            const message = data[0].messages[0].message;
            const payload = JSON.parse(message.payload);
        }
    } catch (err) {
        console.log(err);
        return res.json({messsage : "error while closing order"})
    }

})

export default tradeRouter;



