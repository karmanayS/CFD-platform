import axios from "axios";
import { useEffect, useState } from "react"
import type { AssetPrice } from "../hooks/usePriceFeed";
import toast, { Toaster } from 'react-hot-toast';

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
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/openOrders?userId=user1`);
                setOpenOrders(response.data.openOrders);
            } catch (err) {
                return console.log(err);
            }    
        }
        getData();
    },[]) 

    return <div className="flex flex-col p-2" >
        <div className="grid grid-cols-9 gap-5 font-semibold border-b pb-1" >
            <div className="text-sm" > Coin </div>
            <div className="text-sm" > Quantity </div>
            <div className="text-sm" > Position type </div>
            <div className="text-sm" > Position value </div>
            <div className="text-sm" > Entry price </div>
            <div className="text-sm" > PNL </div>
            <div className="text-sm" > Margin </div>
            <div className="text-sm" > Leverage </div>
            <div> </div>
        </div>
    
        {   
            (openOrders === undefined) ? <div></div> :  openOrders.map((order) => {
                return <div className="grid grid-cols-9 gap-5 py-1 border-b last:border-none" >
                    <div className="text-sm" > {order.asset} </div>
                    <div className="text-sm" > {order.qty} </div>
                    <div className="text-sm" > {order.type} </div>
                    <div className="text-sm" > {order.amount} </div>
                    <div className="text-sm" > {(order.amount) / ( (order.qty) * (order.leverage) )} </div>
                    <Pnl order={order} assetPrices={assetPrices} />
                    <div className="text-sm" > {order.margin} </div>
                    <div className="text-sm" > {order.leverage} </div>
                    <CloseOrder orderId={order.orderId} />
                </div>
            })
        }
        <Toaster/>
    </div>
}



const Pnl = ({order,assetPrices}:{order:OpenOrders,assetPrices:AssetPrice[]}) => {
    let pnl:number;
    //let entryPrice = (order.amount) / ( (order.qty) * (order.leverage) );
    
    if (order.type === "long") {
        const sellingPrice = (assetPrices.find(a => a.asset === order.asset)?.bidPrice ?? 0) * (order.qty * order.leverage); // ==> unitary method not divison
        pnl = sellingPrice - order.amount;
    } else {
        const buyingPrice = (assetPrices.find(a => a.asset === order.asset)?.askPrice ?? 0) * (order.qty * order.leverage) 
        pnl = order.amount - buyingPrice;
    }
    
    return <div className= {`text-sm ${ (pnl>=0) ? "text-green-500" : "text-red-500" }`}  > {(Math.abs(pnl)).toFixed(2)} </div>
}


const CloseOrder = ({orderId}:{orderId:string}) => {

    async function onclickHandler() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/trade/close`,{
                orderId
            });
            if (response.status !== 200) throw new Error("Couldnt close order");
            toast.success("Closed order successfully")
        } catch (err) {
            toast.error("ERROR!: couldn't close order")
            return console.log(err);
        }
    }

    return <div>
        <button onClick={onclickHandler} className="text-center py-1 rounded-md bg-slate-700 hover:bg-slate-900" > Close position </button>
    </div>
}