import axios from "axios";
import { useEffect, useState } from "react"
import type { AssetPrice } from "../hooks/usePriceFeed";

interface OpenOrders {
    userId: string,
    orderId : string,
    asset : string,
    type : "long" | "short",
    qty: number,
    leverage : number,
    amount:number,
    margin: number
}

export const Orders = ({assetPrices}:{assetPrices:AssetPrice[]}) => {
    const [openOrders,setOpenOrders] = useState< OpenOrders[] >([]);

    useEffect(() => {
        async function getData() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/openOrders`);
                setOpenOrders(response.data.openOrders);
            } catch (err) {
                return console.log(err);
            }    
        }
        getData();
    },[]) 

    return <div className="flex flex-col p-2" >
        <div className="grid grid-cols-8 gap-6 font-semibold border-b pb-1" >
            <div className="text-sm" > Coin </div>
            <div className="text-sm" > Quantity </div>
            <div className="text-sm" > Position type </div>
            <div className="text-sm" > Position value </div>
            <div className="text-sm" > Entry price </div>
            <div className="text-sm" > PNL </div>
            <div className="text-sm" > Margin </div>
            <div className="text-sm" > Leverage </div>
        </div>

        {
            openOrders.map((order) => {
                return <div className="grid grid-cols-8 gap-6 py-1 border-b last:border-none" >
                    <div className="text-sm" > {order.asset} </div>
                    <div className="text-sm" > {order.qty} </div>
                    <div className="text-sm" > {order.type} </div>
                    <div className="text-sm" > {order.amount} </div>
                    <div className="text-sm" > {(order.amount) / ( (order.qty) * (order.leverage) )} </div>
                    <Pnl order={order} assetPrices={assetPrices} />
                    <div className="text-sm" > {order.margin} </div>
                    <div className="text-sm" > {order.leverage} </div>
                </div>
            })
        }
    </div>
}



const Pnl = ({order,assetPrices}:{order:OpenOrders,assetPrices:AssetPrice[]}) => {
    let pnl:number;
    let entryPrice = (order.amount) / ( (order.qty) * (order.leverage) );

    if (order.type === "long") {
        pnl = assetPrices.find(a => a.asset === order.asset)?.bidPrice ?? 0 - entryPrice
    } else {
        pnl = entryPrice - (assetPrices.find(a => a.asset === order.asset)?.askPrice ?? 0 )
    }

    return <div className= {`text-sm ${ (pnl>=0) ? "text-green-500" : "text-red-500" }`}  > {Math.abs(pnl)} </div>
}