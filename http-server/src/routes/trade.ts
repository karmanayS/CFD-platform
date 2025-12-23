import express from "express";
import { redis } from "../redisClient";
import { authMiddlware } from "../middlewares/authMiddleware";

const tradeRouter = express.Router();

tradeRouter.post("/create",authMiddlware,async(req,res) => {
    const userId = req.userId
    const {asset,type,qty,leverage} = req.body;
    const randomId = crypto.randomUUID();

    try {
        const response = await redis.xRevRange('EN-EX', '+', '-', {COUNT: 1});
        let lastId;
        if (response.length === 0) {
            lastId = "0"
        } else {
            lastId = response[0].id
        }
        
        await redis.xAdd('EX-EN', '*', {
            randomId,
            type: "openOrder",
            payload :JSON.stringify({
                asset,
                type,
                qty,
                leverage,
                userId
            })
        })

        
        const allMessages = await redis.xRead({
            key: "EN-EX",
            id : lastId
        }, {
            BLOCK : 0
        })
        if (!allMessages) return res.json({
            success: false,
            message: "Did not receive newly created order from engine"
        })
        //@ts-ignore
        const message = allMessages[0].messages.find((entry) => {
            console.log(entry)
            if (entry.message.randomId === randomId) {      
                return entry.message
            }
        })
        
        if (!message) return res.json({
            success: false,
            message : "Couldn't fetch newly created order"
        })
        return res.json({
            success : true,
            orderId: JSON.parse(message.message.payload).orderId
        })
            // if (data) {
            //     //@ts-ignore
            //     const message = data[0].messages[0].message;
            //     if (message.randomId !== randomId) continue;
            //     const response = JSON.parse(message.payload).orderId;
            //     //@ts-ignore
            //     if (message.type === "orderId") {
            //         if (response === "ERROR") throw new Error("Invalid balance")
            //         else {return res.json({orderId : response});}
            //     }
            // } else throw new Error("didnt receive orderId from the redis stream");   
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false,message : "error while creating oder"})
    }       
})

tradeRouter.post("/close",authMiddlware,async(req,res) => {
    const {orderId} = req.body;
    const randomId = crypto.randomUUID();
    while (true) {    
        try {
            const response = await redis.xRevRange('EN-EX', '+', '-', {COUNT: 1});
            let lastId;
            if (response.length === 0) {
                lastId = "0"
            } else {
                lastId = response[0].id
            }

            await redis.xAdd("EX-EN",'*',{
                randomId,
                type: "closeOrder",
                payload: JSON.stringify({
                    orderId
                })
            })
            const data = await redis.xRead({
                key: "EN-EX",
                id : lastId
            }, {
                BLOCK: 0
            })
            if (data) {
                //@ts-ignore
                const message = data[0].messages[0].message;
                if (message.randomId !== randomId) continue;
                const payload = JSON.parse(message.payload);
                if (payload.status === "ERROR") throw new Error("couldnt close order on engine")
                if (message.type === "closeOrderStatus") return res.json({status : payload.status});
            } else throw new Error("no data received from stream")
        } catch (err) {
            console.log(err);
            return res.status(500).json({messsage : "error while closing order"})
        }
    }    
})

export default tradeRouter;



