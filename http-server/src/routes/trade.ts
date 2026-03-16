import express from "express";
import { z } from "zod";
import { redis } from "../redisClient";
import { authMiddlware } from "../middlewares/authMiddleware";
import { streamReader } from "../helpers/streamReader";

const createOrderSchema = z.object({
    asset: z.enum(["BTC", "SOL"]),
    type: z.enum(["long", "short"]),
    qty: z.number().positive("Quantity must be positive"),
    leverage: z.number().int().min(1).max(100),
});

const closeOrderSchema = z.object({
    orderId: z.string().min(1, "orderId is required"),
});

const tradeRouter = express.Router();

tradeRouter.post("/create",authMiddlware,async(req,res) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
    }
    const userId = req.userId
    const {asset,type,qty,leverage} = parsed.data;
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
        const message = await streamReader(lastId,randomId)
        const payload = JSON.parse(message.message.payload)
        if (payload.response === "ERROR") throw new Error("couldnt create order on engine")
        return res.json({
            success : true,
            orderId: payload.response
        })   
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false,message : "error while creating oder"})
    }       
})

tradeRouter.post("/close",authMiddlware,async(req,res) => {
    const parsed = closeOrderSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
    }
    const {orderId} = parsed.data;
    const userId = req.userId
    const randomId = crypto.randomUUID();
        
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
                orderId,
                userId
            })
        })
        const message = await streamReader(lastId,randomId)
        const payload = JSON.parse(message.message.payload)
        if (payload.status === "ERROR") throw new Error("couldnt close order on engine")
        return res.json({
            success : true,
            status: payload.status
        }) 
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false,message : "error while closing order"})
    }    
})

export default tradeRouter;



