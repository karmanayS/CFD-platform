import { useState } from "react";
import { PlaceOrder } from "../components/PlaceOrder";
import { SupportedAssets } from "../components/SupportedAssets";
import { usePriceFeed } from "../hooks/usePriceFeed";
import { Orders } from "../components/Orders";
import { Navbar } from "../components/Navbar";
import { Chart } from "../components/Chart";
import { Toaster } from "react-hot-toast";

export const Dashboard = () => {
  const [asset, setAsset] = useState("BTC");
  const assetPrices = usePriceFeed();

  return (
    <div className="flex flex-col h-screen p-2">
      <Navbar />
      <div className="flex flex-row w-full mb-4">
        <SupportedAssets assetPrices={assetPrices} />

        <div className="flex flex-col flex-1 mx-2 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          
          <div className="mb-4">
            <form className="w-36">
              <select
                onChange={(e) => setAsset(e.target.value)}
                defaultValue="BTC"
                className="block w-full px-3 py-2 text-sm rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition cursor-pointer"
              >
                <option value="BTC" className="bg-gray-800 text-gray-100">
                  Bitcoin
                </option>
                <option value="SOL" className="bg-gray-800 text-gray-100">
                  Solana
                </option>
              </select>
            </form>
          </div>

          {/* Chart */}
          <div className="flex-1 rounded-xl overflow-hidden">
            <Chart asset={asset} />
          </div>
        </div>

        <div className="w-60">
          {" "}
          <PlaceOrder assetPrices={assetPrices} asset={asset} />{" "}
        </div>
      </div>
      <Orders assetPrices={assetPrices} />{" "}
      <Toaster />
    </div>
  );
};
