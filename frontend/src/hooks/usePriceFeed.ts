import { useEffect, useState } from "react";

export interface assetPrice {
    asset: string,
    bidPrice: number,
    askPrice: number
}

export const usePriceFeed = () => {
    const [assets,setAssets]= useState([{
        asset : "BTC",
        price : 0,
        decimal: 4
    }, {
        asset : "SOL",
        price : 0,
        decimal : 6
    }]);

    const btcPrice = (assets.find(a => a.asset === "BTC")?.price ?? 0) / 10000 ; 
    const solPrice = (assets.find(a => a.asset === "SOL")?.price ?? 0) / 1000000 ;

    const assetPrices = [
        {
            asset : "BTC",
            bidPrice : btcPrice - (0.01 * btcPrice),
            askPrice : btcPrice + (0.01 * btcPrice) 
        },
        {
            asset : "SOL",
            bidPrice : solPrice - (0.01 * solPrice),
            askPrice : solPrice + (0.01 * solPrice)
        }
    ]

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");

        socket.onopen = () => {
            console.log("connected to ws server");
        }

        socket.onmessage = (event) => {
            const data  =JSON.parse(event.data);
            const prices = data.price_updates;
            setAssets(prices);
        }

        socket.onclose = () => {
            console.log("connection to the ws server closed");
        }

        return () => {
            socket.close()
        }
    },[])

    return assetPrices;
}