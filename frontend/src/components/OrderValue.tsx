import type { AssetPrice } from "../hooks/usePriceFeed"

export const OrderValue = ({qty,leverage,asset,orderType,assetPrices}:{qty:number,leverage:number,asset:string,orderType:string,assetPrices:AssetPrice[]}) => {
    const ast = assetPrices.find(a => a.asset === asset)
    if (!ast) return <div>$0.00</div>
    const price = (orderType === "long") ? ast.askPrice : ast.bidPrice
    return <div>${(qty*leverage*price).toFixed(2)}</div>
}