import { useState } from "react"
import { OrderValue } from "./OrderValue";
import type { AssetPrice } from "../hooks/usePriceFeed";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

export const PlaceOrder = ({asset,assetPrices}:{asset:string,assetPrices:AssetPrice[]}) => {
    const [orderType,setOrderType] = useState("long");
    const [qty,setQty] = useState(0);
    const [leverage,setLeverage] = useState(1);

    async function placeOrder() {
        const body = {
            asset,
            type: orderType,
            qty,
            leverage,
            userId : "user1"
        }
    
        try {    
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/trade/create`, body);
            if (response.status !== 200) throw new Error("didnt receive orderId")
            toast.success("Placed order successfully") 
        } catch(err) {
            toast.error("ERROR: couldn't place order")
            return console.log(err);
        }    
    }

    return <div className="flex flex-col p-4 border">
        <div className="flex mb-4" >
            <button onClick={() => setOrderType("long")} className={`border w-1/2 py-1 rounded-md text-center ${(orderType === "long") ? "bg-green-500" : "bg-white"} `} > BUY </button>
            <button onClick={() => setOrderType("short")} className={`border w-1/2 py-1 rounded-md text-center ${(orderType === "short") ? "bg-red-500" : "bg-white"} `} > SELL </button>
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

        <button onClick={placeOrder} className="py-1 text-center mt-4 bg-slate-600 hover:bg-slate-800 rounded-md text-sm" > Place Order </button>
        <Toaster />
    </div>
}
