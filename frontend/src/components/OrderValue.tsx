import type { assetPrice } from "../hooks/usePriceFeed"

export const OrderValue = ({qty,leverage,asset,orderType,assetPrices}:{qty:number,leverage:number,asset:string,orderType:string,assetPrices:assetPrice[]}) => {
    if (asset === "BTC") {
        return <div>
            ${(qty * leverage * ((orderType === "BUY") ? assetPrices.find(e => e.asset === "BTC")?.askPrice! : assetPrices.find(e => e.asset === "BTC")?.bidPrice! )).toFixed(2)}
        </div>
    } else {
        return <div>
            ${(qty * leverage * ((orderType === "BUY") ? assetPrices.find(e => e.asset === "SOL")?.askPrice! : assetPrices.find(e => e.asset === "SOL")?.bidPrice! )).toFixed(2)}
        </div>
    }
}