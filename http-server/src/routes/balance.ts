import express from "express";
import { redis } from "../redisClient";

const balanceRouter = express.Router();

balanceRouter.get("/",async(req,res) => {
    const {userId} = req.body;
})

balanceRouter.get("/usd",async(req,res) => {
    const {userId} = req.body;
    const randomId = crypto.randomUUID();
    while (true) {    
        try {
            const response = await redis.xRevRange('EN-EX', '+', '-', {COUNT: 1}) || "0";
            const lastId = response[0].id;

            await redis.xAdd("EX-EN","*",{
                randomId,
                type: "usdBalance",
                payload : JSON.stringify({
                    userId
                })
            })
            const data = await redis.xRead({
                key:  "EN-EX",
                id : lastId
            }, {
                BLOCK: 0
            })
            
            if (data) {
                //@ts-ignore
                const message = data[0].messages[0].message;
                if(message.randomId !== randomId) continue;
                if (message.type === "usdBalance") return res.json({usdBalance: JSON.parse(message.payload).usdBalance})
            } else throw new Error("data is undefined");
        } catch (err) {
            console.log(err)
            return res.json({message : "error mid operation"})
        } 
    }
})

export default balanceRouter;