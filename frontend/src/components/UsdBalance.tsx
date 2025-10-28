import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchBalance } from "../redux/slices/balanceSlice";

export const UsdBalance = () => {
  const { value, loading, error } = useSelector(
    (state: RootState) => state.balance
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchBalance());
  }, []);

  if (loading) <div> Loading... </div>;
  else if (error) <div> Error </div>;
  else {
    return (
      <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center gap-2">
        <span className="text-sm text-gray-300">Balance:</span>
        <span className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          ${value.toFixed(2)}
        </span>
      </div>
    );
  }
};
