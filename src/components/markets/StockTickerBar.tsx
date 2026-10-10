"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Activity, ChevronRight } from "lucide-react";

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function StockTickerBar() {
  const [items, setItems] = useState<TickerItem[]>([
    { symbol: "S&P 500", name: "S&P 500", price: 5864.67, change: 36.21, changePercent: 0.62 },
    { symbol: "NASDAQ", name: "Nasdaq", price: 18518.61, change: 154.28, changePercent: 0.84 },
    { symbol: "DOW", name: "Dow Jones", price: 42514.95, change: 140.16, changePercent: 0.33 },
    { symbol: "NVDA", name: "NVIDIA", price: 144.52, change: 4.88, changePercent: 3.50 },
    { symbol: "AAPL", name: "Apple", price: 234.85, change: 2.45, changePercent: 1.05 },
    { symbol: "MSFT", name: "Microsoft", price: 428.15, change: 3.80, changePercent: 0.90 },
    { symbol: "TSLA", name: "Tesla", price: 255.40, change: -5.80, changePercent: -2.22 },
    { symbol: "GOOGL", name: "Alphabet", price: 174.35, change: 2.15, changePercent: 1.25 },
    { symbol: "AMZN", name: "Amazon", price: 192.65, change: 3.10, changePercent: 1.64 },
    { symbol: "BTC/USD", name: "Bitcoin", price: 66420.50, change: 1590.20, changePercent: 2.45 },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch("/api/markets");
        const data = await res.json();
        if (data.success) {
          const combined: TickerItem[] = [
            ...data.indices.slice(0, 4).map((idx: any) => ({
              symbol: idx.symbol,
              name: idx.name,
              price: idx.value,
              change: idx.change,
              changePercent: idx.changePercent,
            })),
            ...data.stocks.slice(0, 6).map((stk: any) => ({
              symbol: stk.symbol,
              name: stk.name,
              price: stk.price,
              change: stk.change,
              changePercent: stk.changePercent,
            })),
          ];
          setItems(combined);
        }
      } catch {
        // use fallback initial items
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#111111] text-white border-b border-neutral-800 text-xs py-1.5 px-4 overflow-hidden relative shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Label Badge */}
        <Link
          href="/markets"
          className="shrink-0 flex items-center gap-1.5 bg-[#B80000] text-white px-2 py-0.5 rounded-xs font-mono font-bold text-[10px] tracking-wider uppercase hover:bg-[#950000] transition-colors"
          title="Go to Live Stock Market Dashboard"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
          </span>
          <span>MARKETS LIVE</span>
        </Link>

        {/* Scrollable / Running Ticker Strip */}
        <div className="flex-1 overflow-x-auto scrollbar-none flex items-center gap-5 sm:gap-6 py-0.5">
          {items.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <Link
                key={item.symbol}
                href="/markets"
                className="shrink-0 flex items-center gap-1.5 hover:opacity-80 transition-opacity font-mono text-[11px] group"
              >
                <span className="font-bold text-neutral-200 group-hover:text-white">
                  {item.symbol}
                </span>
                <span className="text-neutral-400">
                  ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span
                  className={`flex items-center text-[10px] font-semibold px-1 py-0.2 rounded-xs ${
                    isPositive
                      ? "text-emerald-400 bg-emerald-950/60"
                      : "text-red-400 bg-red-950/60"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                  )}
                  {isPositive ? "+" : ""}
                  {item.changePercent.toFixed(2)}%
                </span>
              </Link>
            );
          })}
        </div>

        {/* Quick Link Button */}
        <Link
          href="/markets"
          className="shrink-0 hidden md:flex items-center gap-1 text-[11px] font-sans font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <span>All Quotes &amp; Rankings</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
