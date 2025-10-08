import { PRICES } from "../db";

export function currentPrice(asset:string,type:"bid" | "ask") {
    if (type === "bid") {
        const price = (PRICES.find(e => e.asset === asset)?.bidPrice ?? 0) / ( (asset === "BTC") ? 10000 : 1000000 )
        return price 
    } else if (type === "ask") {
        const price = (PRICES.find(e => e.asset === asset)?.askPrice ?? 0) / ( (asset === "BTC") ? 10000 : 1000000 )
        return price
    } else {
        return new Error("Invalid price type");
    }
}