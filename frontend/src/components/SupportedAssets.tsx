// import { useEffect, useState } from "react";
import type { AssetPrice } from "../hooks/usePriceFeed";

export interface SupportedAssets {
    symbol  : string,
    name : string,
    imageUrl : string
}

export const SupportedAssets = ({assetPrices}:{assetPrices:AssetPrice[]}) => {
    // const [assets,setAssets] = useState<SupportedAssets[]>([]);
    const assets = [{
        symbol : "BTC",
        name : "Bitcoin",
        imageUrl : "enter image url"
    }, {
        symbol : "SOL",
        name : "Solana",
        imageUrl : "enter image url"
    }]
    // useEffect(() => {
    //     async function fetchData() {
    //         try {    
    //             const response = await fetch("http://localhost:3000/api/v1/supportedAssets");
    //             if (!response.ok) throw new Error(`response status: ${response.status}`)
    //             const data = await response.json();
    //           console.log(data);
    //             setAssets(data.supportedAssets);    
    //         } catch (err) {
    //             return console.log(err);
    //         }    
    //     }
    //     fetchData();
    // },[])
    
    if (!assets) return <div> Loading ...</div>

    return (
  <div className="flex flex-col p-2">
    {/* Header row */}
    <div className="grid grid-cols-4 gap-4 font-semibold border-b pb-1">
      <div className="text-sm">Asset</div>
      <div className="text-sm">Symbol</div>
      <div className="text-sm">Bid</div>
      <div className="text-sm">Ask</div>
    </div>

    {/* Data rows */}
    {assets.map((a) => {
      const bidPrice = assetPrices.find((e) => e.asset === a.symbol)?.bidPrice?.toFixed(2);
      const askPrice = assetPrices.find((e) => e.asset === a.symbol)?.askPrice?.toFixed(2);

      return (
        <div className="grid grid-cols-4 gap-4 py-1 border-b last:border-none">
          <div className="text-sm">{a.name}</div>
          <div className="text-sm">{a.symbol}</div>
          <div className="text-sm">{bidPrice}</div>
          <div className="text-sm">{askPrice}</div>
        </div>
      );
    })}
  </div>
);

}