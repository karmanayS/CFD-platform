import express from "express";
import  { createClient } from "redis";

const tradeRouter = express.Router();
const redis = createClient();
const redis1 = createClient();

redis.connect()
.then(() => {
    console.log("connected to redis client")
})
.catch((err) => {
    console.log(err)
}) //Here we are assuming that someone will hit the server later after the client connection is resolved or rejected because if someone hits the server instantly as the server is up then accessing redis methods might throw error because the redis client may not be connected yet...but this doesnt usually happen
redis1.connect()
.then(() => {
    console.log("connected to redis1 client")
})
.catch((err) => {
    console.log(err)
})

tradeRouter.post("/create",async(req,res) => {
    const {asset,type,qty,amount,userId} = req.body;
    try {    
        await redis.xAdd('createOrder', '*', {
            asset,
            type,
            qty,
            userId
        })    
        const data = await redis.xRead({
            key: 'openOrderId',
            id : '$'
        }, {
            BLOCK : 0
        })
        //@ts-ignore
        if (data) return res.json({orderId : data[0].messages[0].message.orderId})
        else throw new Error("didnt receive orderId from the redis stream");   
    } catch (err) {
        console.log(err);
        return res.json("error while creating oder")
    }   
    
})

tradeRouter.post("/close",async(req,res) => {
    const {orderId,userId} = req.body;
    try {    
        await redis1.xAdd("closeOrder",'*',{
            userId,
            orderId
        })
        //some confirmation from the engine that the order has been closed successfully
        res.json({message : "closed order successfully"})
    } catch (err) {
        console.log(err);
        return res.json({messsage : "error while closing order"})
    }

})

export default tradeRouter;



