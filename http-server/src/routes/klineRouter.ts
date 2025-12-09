import express from "express"
import axios from "axios"
import { authMiddlware } from "../middlewares/authMiddleware";

export const klineRouter = express.Router()

klineRouter.get('/',authMiddlware,async (req,res) => {
    const {symbol,interval,startTime} = req.query;
    try {
        const response = await axios.get(`https://api.backpack.exchange/api/v1/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}`)
        
        res.json({data : response.data})
    } catch(err) {
        console.log(err)
        res.status(403).json({message: "Error"})
    }    
})