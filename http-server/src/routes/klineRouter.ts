import express from "express"
import axios from "axios"
import { authMiddleware } from "../middlewares/authMiddleware";
import * as z from "zod"

const querySchema = z.object({
    symbol: z.string().min(1,"Symbol name should be atleast 1 charachter long"),
    interval: z.string().min(1,"Interval should be atleast 1 charachter long"),
    startTime: z.string().min(1,"Start time should be atleast 1 charachter long")
})
export const klineRouter = express.Router()

klineRouter.get('/',authMiddleware,async (req,res) => {
    try {
        const {data,success} = querySchema.safeParse(req.query);
        if (!success) throw new Error("Invalid query inputs")
        const {symbol,interval,startTime} = data    
        const response = await axios.get(`https://api.backpack.exchange/api/v1/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}`)
        res.json({success: true,data: response.data})
    } catch(err) {
        console.log(err)
        res.status(403).json({success: false,message: "Error"})
    }    
})