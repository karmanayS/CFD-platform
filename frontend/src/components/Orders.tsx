import axios from "axios";
import { useEffect } from "react";
import type { AssetPrice } from "../hooks/usePriceFeed";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import {
  fetchOpenOrders,
  type OpenOrders,
} from "../redux/slices/openOrderSlice";
import { fetchBalance } from "../redux/slices/balanceSlice";

export const Orders = ({ assetPrices }: { assetPrices: AssetPrice[] }) => {
  const { openOrders, loading, error } = useSelector(
    (state: RootState) => state.openOrders
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchOpenOrders());
  }, []);

  return (
    <div className="flex flex-col p-2 ">
      <div className="grid grid-cols-9 gap-5 pb-1 border-b border-white/10 text-gray-300 font-medium text-sm">
        <div>Coin</div>
        <div>Quantity</div>
        <div>Position type</div>
        <div>Position value</div>
        <div>Entry price</div>
        <div>PNL</div>
        <div>Margin</div>
        <div>Leverage</div>
        <div></div>
      </div>

      
      {loading ? (
        <div className="py-2 text-gray-400">Loading...</div>
      ) : error ? (
        <div className="py-2 text-red-400">Error fetching orders</div>
      ) : (
        openOrders.map((order) => (
          <div
            key={order.orderId}
            className="grid grid-cols-9 gap-5 py-2 text-sm text-gray-200 border-b border-white/10 last:border-none transition rounded-md px-1"
          >
            <div>{order.asset}</div>
            <div>{order.qty}</div>
            <div>{order.type}</div>
            <div>{order.amount.toFixed(2)}</div>
            <div>
              {(order.amount / (order.qty * order.leverage)).toFixed(2)}
            </div>
            <Pnl order={order} assetPrices={assetPrices} />
            <div>{order.margin.toFixed(2)}</div>
            <div>{order.leverage}</div>
            <CloseOrder orderId={order.orderId} />
          </div>
        ))
      )}
    </div>
  );
};

const Pnl = ({
  order,
  assetPrices,
}: {
  order: OpenOrders;
  assetPrices: AssetPrice[];
}) => {
  let pnl: number;
  //let entryPrice = (order.amount) / ( (order.qty) * (order.leverage) );

  if (order.type === "long") {
    const sellingPrice =
      (assetPrices.find((a) => a.asset === order.asset)?.bidPrice ?? 0) *
      (order.qty * order.leverage); // ==> unitary method not divison
    pnl = sellingPrice - order.amount;
  } else {
    const buyingPrice =
      (assetPrices.find((a) => a.asset === order.asset)?.askPrice ?? 0) *
      (order.qty * order.leverage);
    pnl = order.amount - buyingPrice;
  }

  return (
    <div className={`text-sm ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
      {" "}
      {Math.abs(pnl).toFixed(2)}{" "}
    </div>
  );
};

const CloseOrder = ({ orderId }: { orderId: string }) => {
  const dispatch = useDispatch<AppDispatch>();

  async function onclickHandler() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/trade/close`,
        {
          orderId,
        }
      );
      if (response.status !== 200) throw new Error("Couldnt close order");
      toast.success("Closed order successfully");
      dispatch(fetchBalance());
      dispatch(fetchOpenOrders());
    } catch (err) {
      toast.error("ERROR!: couldn't close order");
      return console.log(err);
    }
  }

  return (
    <div>
      <button
        onClick={onclickHandler}
        className="text-center py-1 px-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-red-400 hover:bg-white/20 transition font-medium text-sm"
      >
        Close position
      </button>
    </div>
  );
};
