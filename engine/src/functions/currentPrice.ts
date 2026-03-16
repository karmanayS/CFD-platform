import { PRICES } from "../db";
import { scaleFactor } from "../helpers/scaleFactor";

export function currentPrice(asset:string,type:"bid" | "ask") {
    const priceEntry = PRICES.find(e => e.asset === asset);
    if (!priceEntry) throw new Error(`Asset ${asset} not found`);
    const rawPrice = type === "bid" ? priceEntry.bidPrice : priceEntry.askPrice;
    if (rawPrice === 0) throw new Error(`Price for ${asset} not available yet`);
    return rawPrice / (scaleFactor(asset));
}