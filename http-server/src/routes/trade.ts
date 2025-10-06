import express from "express";
import { redis } from "../redisClient";

const tradeRouter = express.Router();

tradeRouter.post("/create",async(req,res) => {
    const {asset,type,qty,leverage,userId} = req.body;
    try {
            
        await redis.xAdd('EX-EN', '*', {
            type: "openOrder",
            payload :JSON.stringify({
                asset,
                type,
                qty,
                leverage,
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
            const response = JSON.parse(message.payload).orderId;
            //@ts-ignore
            if (message.type === "orderId") {
                if (response === "ERROR") throw new Error("Invalid balance")
                else {return res.json({orderId : response});}
            }
        } else throw new Error("didnt receive orderId from the redis stream");   
    } catch (err) {
        console.log(err);
        return res.status(500).json({message : "error while creating oder"})
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
            if (message.type === "closeOrderStatus") return res.json({status : payload.status});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({messsage : "error while closing order"})
    }

})

export default tradeRouter;



