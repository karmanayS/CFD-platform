import { useState } from "react";
import { OrderValue } from "./OrderValue";
import type { AssetPrice } from "../hooks/usePriceFeed";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { fetchBalance } from "../redux/slices/balanceSlice";
import { fetchOpenOrders } from "../redux/slices/openOrderSlice";

export const PlaceOrder = ({
  asset,
  assetPrices,
}: {
  asset: string;
  assetPrices: AssetPrice[];
}) => {
  const [orderType, setOrderType] = useState("long");
  const [qty, setQty] = useState(0);
  const [leverage, setLeverage] = useState(1);
  const dispatch = useDispatch<AppDispatch>();

  async function placeOrder() {
    const body = {
      asset,
      type: orderType,
      qty,
      leverage,
      userId: "user1",
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/trade/create`,
        body
      );
      if (response.status !== 200) throw new Error("didnt receive orderId");
      toast.success("Placed order successfully");
    } catch (err) {
      toast.error("ERROR: couldn't place order");
      return console.log(err);
    }
  }

  return (
    <div className="flex flex-col p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.3)] w-full max-w-sm">
      
      <div className="flex mb-6 gap-3">
        <button
          onClick={() => setOrderType("long")}
          className={`w-1/2 py-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
            orderType === "long"
              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]"
              : "bg-white/10 text-gray-300 border border-white/10 hover:bg-white/20"
          }`}
        >
          BUY
        </button>

        <button
          onClick={() => setOrderType("short")}
          className={`w-1/2 py-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
            orderType === "short"
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              : "bg-white/10 text-gray-300 border border-white/10 hover:bg-white/20"
          }`}
        >
          SELL
        </button>
      </div>

      
      <input
        onChange={(e) => setQty(parseFloat(e.target.value))}
        type="number"
        step="any"
        placeholder="Quantity"
        className="w-full px-3 py-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
      />

      
      <div className="flex flex-col mt-8">
        <input
          type="range"
          min="1"
          max="100"
          defaultValue="1"
          onChange={(e) => setLeverage(parseInt(e.target.value))}
          className="accent-cyan-400 cursor-pointer"
        />
        <div className="mt-2 text-sm text-gray-300">Leverage: {leverage}x</div>
      </div>

      
      <div className="flex flex-col border-y border-white/10 py-4 mt-8 space-y-4">
        <div className="flex justify-between text-xs text-gray-300">
          <div>Order value</div>
          <div>
            <OrderValue
              assetPrices={assetPrices}
              qty={qty}
              asset={asset}
              leverage={leverage}
              orderType={orderType}
            />
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-300">
          <div>Slippage</div>
          <div>Est: 0% | Max: 0.5%</div>
        </div>
      </div>

      
      <button
        onClick={async () => {
          await placeOrder();
          dispatch(fetchBalance());
          dispatch(fetchOpenOrders());
        }}
        className="w-full py-2 mt-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium text-sm tracking-wide shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:opacity-90 transition"
      >
        Place Order
      </button>
    </div>
  );
};
