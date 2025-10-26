import { CandlestickSeries, createChart } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Kline {
  close: string;
  end: string;
  high: string;
  low: string;
  open: string;
  quoteVolume: string;
  start: string;
  trades: string;
  volume: string;
}

export const Chart = React.memo(({ asset }: { asset: string }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [time,setTime] = useState("1m")
    
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = createChart(chartRef.current);
    const candlestickSeries = chart.addSeries(CandlestickSeries);

    async function getData() {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/klines?symbol=${asset}_USDC&interval=${time}&startTime=${((Date.now()/1000) - 80000).toFixed(0)}`
        );

        const formattedData = response.data.data.map((item: Kline) => ({
          time: Math.floor(new Date(item.start).getTime() / 1000), // seconds
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        }));
        candlestickSeries.setData(formattedData);
      } catch (err) {
        console.log(err);
        return;
      }
    }
    getData();
    chart.timeScale().fitContent();

    return () => chart.remove()
  }, [time,asset]);

  return (
    <div className="flex flex-col w-full h-full ">
      <form className="w-36">
        <select
          defaultValue="1m"
          className="block w-full text-xs focus:outline-none mb-3 border border-gray-300 rounded p-1 overflow-y-auto"
          onChange={(e) => setTime(e.target.value)}
        >
          <optgroup label="Minutes">
            <option value="1m">1m</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="30m">30m</option>
          </optgroup>

          <optgroup label="Hours">
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="12h">12h</option>
          </optgroup>

          {/* <optgroup label="Days">
            <option value="1d">1d</option>
            <option value="7d">7d</option>
            <option value="1month">1 month</option>
          </optgroup> */}
        </select>
      </form>

      <div ref={chartRef} className="w-full h-full" ></div>
    </div>
  );
});
