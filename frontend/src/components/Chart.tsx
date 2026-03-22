import { CandlestickSeries, ColorType, createChart } from "lightweight-charts";
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
  const [time, setTime] = useState("15m");

  useEffect(() => {
    if (!chartRef.current) return;
    const container = chartRef.current;
    const chart = createChart(container, {
      width: chartRef.current.clientWidth,
      height: chartRef.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "rgba(0,0,0,0)" }, // fully transparent
        textColor: "#E0E0E0",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "rgba(0, 255, 255, 0.5)",
          width: 1,
          style: 0,
        },
        horzLine: {
          color: "rgba(0, 255, 255, 0.5)",
          width: 1,
          style: 0,
        },
      },
      timeScale: { borderColor: "rgba(255,255,255,0.1)", barSpacing: 10 },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.1)",scaleMargins: {
        top: 0.005,
        bottom: 0.005
      }},
    });
    const candlestickSeries = chart.addSeries(CandlestickSeries);

    async function getData() {
      try {
        const intervalSeconds: Record<string,number> = {
          "1m" : 60,
          "5m" : 5*60,
          "15m" : 15*60,
          "30m" : 30*60,
          "1h" : 60*60,
          "4h" : 4*60*60,
          "12h" : 12*60*60
        }
        const candleCount = 200
        const startTime = Math.floor(Date.now() / 1000) - intervalSeconds[time] * candleCount;
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/klines?symbol=${asset}_USDC&interval=${time}&startTime=${startTime}`
        , {
          withCredentials: true
        });
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

    const resizeObserver = new ResizeObserver(() => {
      chart.resize(container.clientWidth, container.clientHeight);
      chart.timeScale().fitContent();
    });

    resizeObserver.observe(container);

    //WS for live candle
    const socket = new WebSocket(`wss://fstream.binance.com/ws/${asset.toLowerCase()}usdt@kline_${time}`)
    socket.onopen = () => {
      console.log("Connected to binance ws server")
    }
    socket.onmessage = (message) => {
      const data = JSON.parse(message.data).k
      const formatted:any = {
        time: data.t/1000, //seconds
        open: parseFloat(data.o),
        high: parseFloat(data.h),
        low: parseFloat(data.l),
        close: parseFloat(data.c)
      }
      candlestickSeries.update(formatted)
    }
    socket.onerror = (message) => {
      console.log("Error in binance ws: ",message)
      socket.close()
    }
    socket.onclose = () => {
      console.log("Disconnected from binance ws server")
    }

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      socket.close()
    };
  }, [time, asset]);

  return (
    <div className="flex flex-col w-full h-full">
      
      <form className="w-36 mb-3">
        <select
          defaultValue="15m"
          onChange={(e) => setTime(e.target.value)}
          className="block w-full text-sm px-3 py-2 rounded-xl bg-transparent border border-transparent text-gray-200 focus:outline-none focus:ring-offset-0 transition cursor-pointer"
        >
          <optgroup label="Minutes" className="bg-gray-800 text-gray-100">
            <option value="1m">1m</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="30m">30m</option>
          </optgroup>
          <optgroup label="Hours" className="bg-gray-800 text-gray-100">
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="12h">12h</option>
          </optgroup>
        </select>
      </form>

      
      <div ref={chartRef} className="flex-1 w-full h-full" />
    </div>
  );
});
