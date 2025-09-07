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
})

tradeRouter.post("/create",async(req,res) => {
    const {asset,type,qty,amount} = req.body;
    let orderId = "";
    try {
        await redis.subscribe("openOrderId",(message,channel) => {
          orderId = JSON.parse(message);  
        })    
        await redis.xAdd('orders', '*', {
            asset,
            type,
            qty,
            amount
        })
        if (orderId !== "") {
            redis.unsubscribe("openOrderId");
            res.json({orderId});
        }
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

async function f() {
    await new Promise((resolve,reject) => {
        setTimeout(resolve,3000)
    })

    console.log("promise is resolved")
}

