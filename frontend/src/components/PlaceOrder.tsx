import { useState } from "react"
import { OrderValue } from "./OrderValue";
import type { assetPrice } from "../hooks/usePriceFeed";

export const PlaceOrder = ({asset,assetPrices}:{asset:string,assetPrices:assetPrice[]}) => {
    const [orderType,setOrderType] = useState("BUY");
    const [qty,setQty] = useState(0);
    const [leverage,setLeverage] = useState(1);

    function placeOrder() {

    }

    return <div className="flex flex-col p-4 border">
        <div className="flex mb-4" >
            <button onClick={() => setOrderType("BUY")} className={`border w-1/2 py-1 rounded-md text-center ${(orderType === "BUY") ? "bg-blue-500" : "bg-white"} `} > BUY </button>
            <button onClick={() => setOrderType("SELL")} className={`border w-1/2 py-1 rounded-md text-center ${(orderType === "SELL") ? "bg-red-500" : "bg-white"} `} > SELL </button>
        </div>

        <input onChange={(e) => setQty(parseFloat(e.target.value))} type="number" step="any" placeholder="quantity" className=" focus:outline-none px-2 py-1 rounded-md border" />

        <div className="flex flex-col mt-8">
            <input type="range" min="1" max="100" defaultValue="1" onChange={e => setLeverage(parseInt(e.target.value))} />
            <div className="mt-1 text-sm" >Leverage: {leverage}x</div>
        </div>

        <div className="flex flex-col border-y p-2 mt-8" >
            <div className="flex justify-between" >
                <div className="text-xs" >Order value</div>
                <div className="text-xs" > <OrderValue assetPrices={assetPrices} qty={qty} asset={asset} leverage={leverage} orderType={orderType} /> </div>
            </div>

            <div className="flex justify-between mt-4" >
                <div className="text-xs" >Slippage</div>
                <div className="text-xs" > Est: 0% | Max: 0.5% </div>
            </div>
        </div>

        <button className="py-1 text-center mt-4 bg-slate-600 hover:bg-slate-800 rounded-md text-sm" > Place Order </button>
    </div>
}
