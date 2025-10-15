import { useEffect, useState } from "react";
import type { AssetPrice } from "../hooks/usePriceFeed";
import axios from "axios";

export interface SupportedAssets {
    symbol  : string,
    name : string,
    imageUrl : string
}

export const SupportedAssets = ({assetPrices}:{assetPrices:AssetPrice[]}) => {
    const [assets,setAssets] = useState<SupportedAssets[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {    
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/supportedAssets`);
                const supportedAssets = response.data.supportedAssets;
                setAssets(supportedAssets);    
            } catch (err) {
                return console.log(err);
            }    
        }
        fetchData();
    },[])
    
    if (!assets) return <div> Loading ...</div>

    return (
      <div className="flex flex-col p-2">
        <div className="grid grid-cols-4 gap-4 font-semibold border-b pb-1">
          <div className="text-sm">Asset</div>
          <div className="text-sm">Symbol</div>
          <div className="text-sm">Bid</div>
          <div className="text-sm">Ask</div>
        </div>

        {assets.map((a) => {
          const bidPrice = assetPrices.find((e) => e.asset === a.symbol)?.bidPrice?.toFixed(2);
          const askPrice = assetPrices.find((e) => e.asset === a.symbol)?.askPrice?.toFixed(2);

          return (
            <div key={a.name} className="grid grid-cols-4 gap-4 py-1 border-b last:border-none">
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