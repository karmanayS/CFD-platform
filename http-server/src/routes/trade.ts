import express from "express";
import  { createClient } from "redis";

const tradeRouter = express.Router();
const redis = createClient();
redis.connect()
.then(() => {
    console.log("connected to redis client")
})
.catch((err) => {
    console.log(err)
}) //Here we are assuming that someone will hit the server later after the client connection is resolved or rejected because if someone hits the server instantly as the server is up then accessing redis methods might throw error because the redis client may not be connected yet...but this doesnt usually happen

tradeRouter.post("/create",async(req,res) => {
    const {asset,type,qty,amount} = req.body;
    let orderId:string;
    try {    
        await redis.xAdd('createOrder', '*', {
            asset,
            type,
            qty,
            amount
        })
        res.json({message: "message sent"})
        // await read from the other stream which has incoming messages from the engine
    } catch (err) {
        console.log(err);
        return res.json("error while creating oder")
    }   
    
})

tradeRouter.post("/close",async(req,res) => {
    const {orderId} = req.body;
    try {    
        await redis.xAdd("closeOrders",'*',{
            orderId
        })
        //some confirmation from the engine that the order has been closed successfully
        res.json({message : "closed order successfully"})
    } catch (err) {
        console.log(err);
        return res.json({messsage : "error while closing order"})
    }    
    //redis logic to send the orderId to the engine and close the order on the engine

})

export default tradeRouter;



