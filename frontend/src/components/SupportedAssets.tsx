import { useEffect, useState } from "react";
import type { AssetPrice } from "../hooks/usePriceFeed";
import axios from "axios";

export interface SupportedAssets {
  symbol: string;
  name: string;
  imageUrl: string;
}

export const SupportedAssets = ({
  assetPrices,
}: {
  assetPrices: AssetPrice[];
}) => {
  const [assets, setAssets] = useState<SupportedAssets[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/supportedAssets`
        );
        const supportedAssets = response.data.supportedAssets;
        setAssets(supportedAssets);
      } catch (err) {
        return console.log(err);
      }
    }
    fetchData();
  }, []);

  if (!assets) return <div> Loading ...</div>;

  return (
    <div className="flex flex-col p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] w-80">
      
      <div className="grid grid-cols-4 gap-4 pb-1 border-b border-white/10 text-gray-300 font-medium uppercase tracking-wide text-sm">
        <div>Asset</div>
        <div>Symbol</div>
        <div className="text-right">Bid</div>
        <div className="text-right">Ask</div>
      </div>

      
      <div className="divide-y divide-white/10 mt-1">
        {assets.map((a) => {
          const bidPrice = assetPrices
            .find((e) => e.asset === a.symbol)
            ?.bidPrice?.toFixed(2);
          const askPrice = assetPrices
            .find((e) => e.asset === a.symbol)
            ?.askPrice?.toFixed(2);

          return (
            <div
              key={a.name}
              className="grid grid-cols-4 gap-4 py-1 text-sm text-gray-200 hover:bg-white/5 transition rounded-md px-1"
            >
              <div className="font-medium">{a.name}</div>
              <div className="text-gray-400">{a.symbol}</div>
              <div className="text-right text-red-400">{bidPrice}</div>
              <div className="text-right text-green-400">{askPrice}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
