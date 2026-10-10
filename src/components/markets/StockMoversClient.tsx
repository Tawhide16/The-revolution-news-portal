"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Globe,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ShieldCheck,
  X,
  ExternalLink,
  Zap,
  Flame,
  Award,
  ChevronRight,
  Clock,
  Compass,
} from "lucide-react";
import {
  StockQuote,
  MarketIndex,
  SectorPerformance,
  CommodityQuote,
  CurrencyQuote,
  BondYield,
  MarketNewsItem,
  MarketStatus,
} from "@/types/markets";
import {
  WORLD_MARKETS,
  SECTORS as INITIAL_SECTORS,
  COMMODITIES as INITIAL_COMMODITIES,
  CURRENCIES as INITIAL_CURRENCIES,
  BONDS as INITIAL_BONDS,
  MARKET_NEWS as INITIAL_NEWS,
  WorldMarketRegion,
} from "@/lib/marketData";

type MoverTab = "active" | "gainers" | "losers" | "highs52" | "lows52";
type RegionTab = "americas" | "europe" | "apac";

export default function StockMoversClient() {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [worldRegions, setWorldRegions] = useState<WorldMarketRegion[]>(WORLD_MARKETS);
  const [sectors, setSectors] = useState<SectorPerformance[]>(INITIAL_SECTORS);
  const [commodities, setCommodities] = useState<CommodityQuote[]>(INITIAL_COMMODITIES);
  const [currencies, setCurrencies] = useState<CurrencyQuote[]>(INITIAL_CURRENCIES);
  const [bonds, setBonds] = useState<BondYield[]>(INITIAL_BONDS);
  const [news, setNews] = useState<MarketNewsItem[]>(INITIAL_NEWS);
  const [marketStatus, setMarketStatus] = useState<any>(null);

  const [activeMoverTab, setActiveMoverTab] = useState<MoverTab>("active");
  const [activeRegion, setActiveRegion] = useState<RegionTab>("americas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null);
  const [selectedNews, setSelectedNews] = useState<MarketNewsItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch real-time data from API
  const fetchMarketData = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/markets", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        if (data.stocks) setStocks(data.stocks);
        if (data.indices) setIndices(data.indices);
        if (data.worldMarkets) setWorldRegions(data.worldMarkets);
        if (data.sectors) setSectors(data.sectors);
        if (data.commodities) setCommodities(data.commodities);
        if (data.currencies) setCurrencies(data.currencies);
        if (data.bonds) setBonds(data.bonds);
        if (data.marketNews) setNews(data.marketNews);
        if (data.marketStatus) setMarketStatus(data.marketStatus);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch stock movers data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Periodic tick every 8 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchMarketData, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchMarketData]);

  // Filtered Stock Movers based on active tab & search
  const displayedMovers = useMemo(() => {
    let list = [...stocks];

    if (activeMoverTab === "active") {
      list.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
    } else if (activeMoverTab === "gainers") {
      list = list.filter((s) => s.change > 0).sort((a, b) => b.changePercent - a.changePercent);
    } else if (activeMoverTab === "losers") {
      list = list.filter((s) => s.change < 0).sort((a, b) => a.changePercent - b.changePercent);
    } else if (activeMoverTab === "highs52") {
      list.sort((a, b) => b.price / b.high52w - a.price / a.high52w);
    } else if (activeMoverTab === "lows52") {
      list.sort((a, b) => (a.price - a.low52w) / a.low52w - (b.price - b.low52w) / b.low52w);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q)
      );
    }

    return list.slice(0, 10);
  }, [stocks, activeMoverTab, searchQuery]);

  // Current World Region Indices
  const currentRegionIndices = useMemo(() => {
    const region = worldRegions.find((r) => r.code === activeRegion);
    return region?.indices || [];
  }, [worldRegions, activeRegion]);

  // Top 3 primary benchmark indices for the top cards
  const topThreeIndices = useMemo(() => {
    const dow = indices.find((i) => i.symbol === "DOW" || i.symbol === "DJIA") || {
      symbol: "DOW",
      name: "Dow Jones Industrial",
      value: 42514.95,
      change: 140.16,
      changePercent: 0.33,
      high: 42580.4,
      low: 42420.2,
      sparkline: [42350, 42410, 42390, 42480, 42500, 42460, 42514.95],
    };
    const sp500 = indices.find((i) => i.symbol === "S&P 500") || {
      symbol: "S&P 500",
      name: "S&P 500 Index",
      value: 5864.67,
      change: 36.21,
      changePercent: 0.62,
      high: 5871.2,
      low: 5842.1,
      sparkline: [5830, 5842, 5838, 5855, 5860, 5852, 5864.67],
    };
    const nasdaq = indices.find((i) => i.symbol === "NASDAQ") || {
      symbol: "NASDAQ",
      name: "Nasdaq Composite",
      value: 18518.61,
      change: 154.28,
      changePercent: 0.84,
      high: 18560.1,
      low: 18410.5,
      sparkline: [18380, 18420, 18400, 18470, 18500, 18490, 18518.61],
    };

    return [dow, sp500, nasdaq];
  }, [indices]);

  return (
    <div className="w-full bg-[#F4F5F7] min-h-screen text-[#1A1A1A] font-sans pb-16">
      {/* Sub-header Banner Bar */}
      <div className="bg-white border-b border-neutral-200 shadow-2xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#B80000] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-xs">
                  CNN BUSINESS &bull; FINANCIAL MARKETS
                </span>
                <span className="text-xs text-neutral-500 font-mono flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <span>
                    MARKETS OPEN &bull; {marketStatus?.localTime || "NYSE / NASDAQ 4:00 PM EST"}
                  </span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-[#111111]">
                Stock Movers &amp; Market Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 font-sans mt-0.5">
                Real-time equities tracking, global market indices, sector performance, commodities, currencies, and corporate wire.
              </p>
            </div>

            {/* Controls Ribbon */}
            <div className="flex items-center gap-2 self-start md:self-center shrink-0">
              <label className="flex items-center gap-1.5 text-xs text-neutral-700 cursor-pointer bg-neutral-50 px-3 py-1.5 border border-neutral-300 rounded shadow-2xs select-none hover:bg-neutral-100 transition-colors">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded text-[#B80000] focus:ring-0 cursor-pointer"
                />
                <span className="font-semibold">Auto-Refresh (8s)</span>
              </label>

              <button
                onClick={fetchMarketData}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-[#1A1A1A] hover:bg-[#B80000] text-white transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                <span>{refreshing ? "Updating..." : "Refresh"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        {/* ========================================================= */}
        {/* 1. TOP 3 INDEX CARDS HERO (CNN STYLE)                     */}
        {/* ========================================================= */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topThreeIndices.map((idx) => {
              const isPos = idx.change >= 0;
              const sparkline = idx.sparkline || [100, 102, 101, 104, 103, 106, 105];
              const minVal = Math.min(...sparkline);
              const maxVal = Math.max(...sparkline);
              const range = maxVal - minVal || 1;

              return (
                <div
                  key={idx.symbol}
                  className="bg-white border border-neutral-200/90 rounded-sm p-4 sm:p-5 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-sans">
                        {idx.name}
                      </div>
                      <div className="text-2xl sm:text-3xl font-mono font-bold text-[#111111] mt-1 tracking-tight">
                        {idx.value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>

                    {/* Change Pill */}
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        isPos
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {isPos ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isPos ? "+" : ""}
                        {idx.change.toFixed(2)}
                      </span>
                      <span>
                        ({isPos ? "+" : ""}
                        {idx.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  {/* Sparkline & Range Bar */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-end justify-between gap-4">
                    <div className="w-full">
                      <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-1">
                        <span>Day Low: {idx.low?.toFixed(2)}</span>
                        <span>Day High: {idx.high?.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full ${isPos ? "bg-emerald-500" : "bg-red-500"}`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                10,
                                (((idx.value - (idx.low || idx.value * 0.99)) /
                                  (((idx.high || idx.value * 1.01) - (idx.low || idx.value * 0.99)) ||
                                    1)) *
                                  100)
                              )
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Mini Sparkline Chart */}
                    <div className="w-24 h-8 shrink-0">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                        <polyline
                          fill="none"
                          stroke={isPos ? "#059669" : "#dc2626"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={sparkline
                            .map((v, i) => {
                              const x = (i / (sparkline.length - 1)) * 95 + 2;
                              const y = 26 - ((v - minVal) / range) * 22;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. TOP MARKET DATA / STOCK MOVERS MAIN TABLE (WIDE)       */}
        {/* ========================================================= */}
        <section className="bg-white border border-neutral-200 rounded-sm shadow-xs overflow-hidden">
          {/* Section Header with Title & Filter Tabs */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B80000]"></span>
                <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#111111] uppercase">
                  Top Market Data &bull; Stock Movers
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Real-time volume leaders, percentage advancers, decliners, and 52-week breakout equities.
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                {[
                  { id: "active", label: "Most Active", icon: Zap },
                  { id: "gainers", label: "Gainers", icon: TrendingUp },
                  { id: "losers", label: "Losers", icon: TrendingDown },
                  { id: "highs52", label: "52-Wk Highs", icon: Flame },
                  { id: "lows52", label: "52-Wk Lows", icon: Award },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeMoverTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveMoverTab(tab.id as MoverTab)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-[#111111] text-white shadow-2xs"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Search Box */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search ticker (e.g. NVDA)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded text-xs focus:outline-none focus:border-[#B80000] focus:bg-white font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-neutral-600 font-semibold uppercase tracking-wider text-[11px] border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Company &amp; Ticker</th>
                  <th className="py-3 px-4 text-right">Last Price</th>
                  <th className="py-3 px-4 text-right">Change</th>
                  <th className="py-3 px-4 text-right">% Change</th>
                  <th className="py-3 px-4 text-center hidden md:table-cell w-48">
                    52-Week Range
                  </th>
                  <th className="py-3 px-4 text-center hidden lg:table-cell w-28">
                    7-Day Trend
                  </th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">Trading Volume</th>
                  <th className="py-3 px-4 text-right hidden xl:table-cell">Market Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                {loading && stocks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-neutral-400 font-sans">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#B80000]" />
                      Streaming high-frequency equity data...
                    </td>
                  </tr>
                ) : displayedMovers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-neutral-500 font-sans">
                      No stock movers matching &ldquo;{searchQuery}&rdquo; found.
                    </td>
                  </tr>
                ) : (
                  displayedMovers.map((stock, idx) => {
                    const isPos = stock.change >= 0;
                    // Compute 52-week position percentage
                    const range52 = stock.high52w - stock.low52w || 1;
                    const pos52 = Math.min(
                      100,
                      Math.max(0, ((stock.price - stock.low52w) / range52) * 100)
                    );

                    return (
                      <tr
                        key={stock.symbol}
                        onClick={() => setSelectedStock(stock)}
                        className="hover:bg-neutral-50/90 transition-colors cursor-pointer group"
                      >
                        {/* Index */}
                        <td className="py-3.5 px-4 text-center text-neutral-400 font-bold group-hover:text-[#B80000]">
                          {idx + 1}
                        </td>

                        {/* Company & Ticker */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded bg-white border border-neutral-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs group-hover:border-[#B80000] transition-colors p-1">
                              {stock.logoUrl ? (
                                <img
                                  src={stock.logoUrl}
                                  alt={stock.symbol}
                                  className="w-full h-full object-contain"
                                  loading="lazy"
                                  onError={(e) => {
                                    const img = e.currentTarget as HTMLImageElement;
                                    if (!img.src.includes("google.com/s2/favicons")) {
                                      img.src = `https://www.google.com/s2/favicons?domain=${stock.symbol.toLowerCase()}.com&sz=128`;
                                    } else {
                                      img.style.display = "none";
                                    }
                                  }}
                                />
                              ) : (
                                <span className="font-bold text-xs text-[#111111]">{stock.symbol.slice(0, 2)}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-[#111111] group-hover:text-[#B80000] transition-colors flex items-center gap-1.5 font-sans text-sm">
                                <span>{stock.symbol}</span>
                                <span className="font-normal text-xs text-neutral-500 truncate max-w-[140px] sm:max-w-[200px]">
                                  {stock.name}
                                </span>
                              </div>
                              <div className="text-[10px] text-neutral-400 font-sans uppercase">
                                {stock.sector}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 text-right font-bold text-[#111111] text-sm">
                          ${stock.price.toFixed(2)}
                        </td>

                        {/* Net Change */}
                        <td
                          className={`py-3.5 px-4 text-right font-semibold ${
                            isPos ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {isPos ? "+" : ""}
                          {stock.change.toFixed(2)}
                        </td>

                        {/* % Change Badge */}
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                              isPos
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {isPos ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </td>

                        {/* 52-Week Range Bar */}
                        <td className="py-3.5 px-4 text-center hidden md:table-cell">
                          <div className="w-full max-w-[180px] mx-auto">
                            <div className="flex justify-between text-[10px] text-neutral-400 font-mono mb-1">
                              <span>${stock.low52w.toFixed(0)}</span>
                              <span>${stock.high52w.toFixed(0)}</span>
                            </div>
                            <div className="w-full h-2 bg-neutral-200 rounded-full relative overflow-hidden">
                              <div
                                className="h-full bg-neutral-800 rounded-full"
                                style={{ width: `${pos52}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* 7-Day Trend Sparkline */}
                        <td className="py-3.5 px-4 text-center hidden lg:table-cell">
                          <div className="w-20 h-6 mx-auto">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                              <polyline
                                fill="none"
                                stroke={isPos ? "#059669" : "#dc2626"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={stock.sparkline
                                  .map((v, i) => {
                                    const min = Math.min(...stock.sparkline);
                                    const max = Math.max(...stock.sparkline);
                                    const r = max - min || 1;
                                    const x = (i / (stock.sparkline.length - 1)) * 90 + 5;
                                    const y = 24 - ((v - min) / r) * 18;
                                    return `${x},${y}`;
                                  })
                                  .join(" ")}
                              />
                            </svg>
                          </div>
                        </td>

                        {/* Volume */}
                        <td className="py-3.5 px-4 text-right text-neutral-600 hidden sm:table-cell">
                          {stock.volume}
                        </td>

                        {/* Market Cap */}
                        <td className="py-3.5 px-4 text-right font-bold text-neutral-800 hidden xl:table-cell">
                          {stock.marketCap}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-neutral-50 border-t border-neutral-200 text-center text-xs text-neutral-500 font-sans">
            Displaying Top 10 High-Frequency Real-Time Equity Movers &bull; Click any row for in-depth balance sheet and consensus analyst analytics.
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. TWO-COLUMN SPLIT: WORLD MARKETS MAP + MARKET NEWS      */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SUB-COLUMN: WORLD MARKETS (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-sm shadow-xs p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#B80000]" />
                  <h2 className="text-xl font-serif font-black tracking-tight text-[#111111] uppercase">
                    World Markets
                  </h2>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Real-time indices across North America, Europe, and Asia-Pacific.
                </p>
              </div>

              {/* Region Selector Pills */}
              <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded">
                {[
                  { id: "americas", label: "Americas" },
                  { id: "europe", label: "Europe" },
                  { id: "apac", label: "Asia / Pacific" },
                ].map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => setActiveRegion(reg.id as RegionTab)}
                    className={`px-3 py-1 text-xs font-bold rounded-xs transition-colors cursor-pointer ${
                      activeRegion === reg.id
                        ? "bg-white text-[#111111] shadow-2xs"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stylized World Map Graphic */}
            <div className="bg-[#111827] rounded-sm p-4 text-white relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-neutral-300 mb-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-emerald-400 font-bold">GLOBAL TRADING RADAR</span>
                </span>
                <span>Region Active: {activeRegion.toUpperCase()}</span>
              </div>

              {/* Stylized Vector World Map Canvas */}
              <div className="w-full h-36 relative flex items-center justify-center opacity-90">
                <svg viewBox="0 0 800 350" className="w-full h-full text-neutral-700">
                  {/* Stylized World Landmass outlines */}
                  {/* North America */}
                  <path
                    d="M 120 70 Q 150 50 200 60 Q 240 80 230 130 Q 190 170 170 210 Q 130 180 110 130 Z"
                    fill={activeRegion === "americas" ? "#047857" : "#374151"}
                    className="transition-colors duration-300"
                  />
                  {/* South America */}
                  <path
                    d="M 210 210 Q 250 240 260 290 Q 230 340 210 320 Q 190 270 210 210 Z"
                    fill={activeRegion === "americas" ? "#065f46" : "#374151"}
                    className="transition-colors duration-300"
                  />
                  {/* Europe */}
                  <path
                    d="M 400 60 Q 460 50 490 90 Q 470 140 430 140 Q 390 110 400 60 Z"
                    fill={activeRegion === "europe" ? "#047857" : "#374151"}
                    className="transition-colors duration-300"
                  />
                  {/* Africa */}
                  <path
                    d="M 420 150 Q 480 160 490 230 Q 460 300 440 310 Q 410 250 410 190 Z"
                    fill="#374151"
                  />
                  {/* Asia */}
                  <path
                    d="M 490 60 Q 620 50 680 110 Q 690 180 620 200 Q 530 180 490 130 Z"
                    fill={activeRegion === "apac" ? "#047857" : "#374151"}
                    className="transition-colors duration-300"
                  />
                  {/* Australia */}
                  <path
                    d="M 640 240 Q 710 240 710 290 Q 670 310 630 280 Z"
                    fill={activeRegion === "apac" ? "#065f46" : "#374151"}
                    className="transition-colors duration-300"
                  />

                  {/* Hotspot Pulsing dots */}
                  {/* New York / Wall Street */}
                  <circle cx="210" cy="110" r="5" fill="#10b981" />
                  <circle cx="210" cy="110" r="10" fill="#10b981" opacity="0.4" />
                  {/* London */}
                  <circle cx="420" cy="85" r="5" fill="#10b981" />
                  <circle cx="420" cy="85" r="10" fill="#10b981" opacity="0.4" />
                  {/* Tokyo */}
                  <circle cx="680" cy="120" r="5" fill="#10b981" />
                  <circle cx="680" cy="120" r="10" fill="#10b981" opacity="0.4" />
                  {/* Hong Kong */}
                  <circle cx="630" cy="165" r="5" fill="#ef4444" />
                </svg>

                <div className="absolute bottom-2 left-3 text-[11px] font-mono text-neutral-300 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Advancing Exchanges
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span> Declining Exchanges
                  </span>
                </div>
              </div>
            </div>

            {/* Region Indices Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F9FA] text-neutral-600 font-semibold uppercase text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-3">Benchmark Index</th>
                    <th className="py-2.5 px-3">Exchange / Region</th>
                    <th className="py-2.5 px-3 text-right">Level</th>
                    <th className="py-2.5 px-3 text-right">Change</th>
                    <th className="py-2.5 px-3 text-right">% Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono">
                  {currentRegionIndices.map((idx) => {
                    const isPos = idx.change >= 0;
                    return (
                      <tr key={idx.symbol} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[#111111] font-sans">
                          {idx.name}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-500 font-sans">{idx.region}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-neutral-900">
                          {idx.value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          className={`py-2.5 px-3 text-right font-semibold ${
                            isPos ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {isPos ? "+" : ""}
                          {idx.change.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
                              isPos
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-red-50 text-red-800"
                            }`}
                          >
                            {isPos ? "+" : ""}
                            {idx.changePercent.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT SUB-COLUMN: MARKET NEWS (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-sm shadow-xs p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#B80000]"></span>
                  <h2 className="text-xl font-serif font-black tracking-tight text-[#111111] uppercase">
                    Market News
                  </h2>
                </div>
                <span className="text-xs text-neutral-400 font-mono">FINANCIAL WIRE</span>
              </div>

              {/* Lead Top News Card */}
              {news[0] && (
                <div
                  onClick={() => setSelectedNews(news[0])}
                  className="group cursor-pointer pb-4 border-b border-neutral-200"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded bg-neutral-100 mb-3">
                    <img
                      src={news[0].imageUrl}
                      alt={news[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-[#B80000] text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-xs">
                      {news[0].category}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#111111] group-hover:text-[#B80000] transition-colors leading-snug">
                    {news[0].title}
                  </h3>
                  <p className="text-xs text-neutral-600 font-sans mt-1.5 line-clamp-2 leading-relaxed">
                    {news[0].summary}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mt-2">
                    <span>{news[0].source}</span>
                    <span>&bull;</span>
                    <span>{news[0].time}</span>
                  </div>
                </div>
              )}

              {/* Secondary News Stream (Rows) */}
              <div className="divide-y divide-neutral-100 mt-2">
                {news.slice(1, 5).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedNews(item)}
                    className="py-3 flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="w-20 h-16 shrink-0 rounded overflow-hidden bg-neutral-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono font-bold text-[#B80000] uppercase block">
                        {item.category}
                      </span>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#111111] group-hover:text-[#B80000] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <div className="text-[10px] text-neutral-400 font-mono mt-1">
                        {item.time} &bull; {item.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/category/business"
              className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#111111] hover:text-[#B80000] transition-colors"
            >
              <span>Explore All Global Business Wire</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. SECTOR SUMMARY & PERFORMANCE HEATMAP STRIP             */}
        {/* ========================================================= */}
        <section className="bg-white border border-neutral-200 rounded-sm shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#B80000]" />
                <h2 className="text-xl font-serif font-black tracking-tight text-[#111111] uppercase">
                  Sector Summary &amp; Wall Street Weights
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Daily returns across all 11 primary S&amp;P 500 economic industry sectors.
              </p>
            </div>
            <div className="text-xs font-mono text-neutral-400">
              Benchmark: S&amp;P 500 Daily Equal Weight
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sectors.map((sec) => {
              const isPos = sec.performancePercent >= 0;
              return (
                <div
                  key={sec.name}
                  className="p-3 bg-neutral-50 rounded border border-neutral-200 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-[#111111] font-sans truncate pr-2">
                      {sec.name}
                    </span>
                    <span
                      className={`font-mono font-bold text-xs ${
                        isPos ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {isPos ? "+" : ""}
                      {sec.performancePercent.toFixed(2)}%
                    </span>
                  </div>

                  {/* Relative bar meter */}
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${isPos ? "bg-emerald-600" : "bg-red-600"}`}
                      style={{
                        width: `${Math.min(100, Math.max(15, Math.abs(sec.performancePercent) * 35))}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 font-sans">
                    <span>Index Weight: <strong>{sec.marketWeight}</strong></span>
                    <span className="truncate max-w-[130px]">
                      Leader: <strong>{sec.leader}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. COMMODITIES, FOREX & CRYPTO, BONDS & RATES CARDS       */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: COMMODITIES */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#B80000]" />
                  <h3 className="font-serif font-black text-lg text-[#111111] uppercase">
                    Commodities
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">NYMEX / COMEX</span>
              </div>

              <div className="divide-y divide-neutral-100 text-xs">
                {commodities.map((item) => {
                  const isPos = item.change >= 0;
                  return (
                    <div key={item.symbol} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#111111] font-sans">{item.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {item.symbol} &bull; {item.unit}
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-neutral-900">${item.price.toFixed(2)}</div>
                        <div
                          className={`text-[11px] font-semibold ${
                            isPos ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {isPos ? "+" : ""}
                          {item.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 font-mono">
              Energy &bull; Precious Metals &bull; Agriculture
            </div>
          </div>

          {/* Card 2: CURRENCIES & CRYPTOCURRENCIES */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#B80000]" />
                  <h3 className="font-serif font-black text-lg text-[#111111] uppercase">
                    Currencies &amp; Crypto
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">FX / 24H</span>
              </div>

              <div className="divide-y divide-neutral-100 text-xs">
                {currencies.map((item) => {
                  const isPos = item.change >= 0;
                  return (
                    <div key={item.symbol} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#111111] font-sans flex items-center gap-1.5">
                          <span>{item.symbol}</span>
                          {item.isCrypto && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-mono font-bold px-1 rounded">
                              CRYPTO
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-sans">{item.name}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-neutral-900">
                          {item.rate >= 100
                            ? item.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })
                            : item.rate.toFixed(4)}
                        </div>
                        <div
                          className={`text-[11px] font-semibold ${
                            isPos ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {isPos ? "+" : ""}
                          {item.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 font-mono">
              Major Foreign Exchange Pairs &amp; Digital Assets
            </div>
          </div>

          {/* Card 3: US TREASURY BONDS & RATES */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#B80000]" />
                  <h3 className="font-serif font-black text-lg text-[#111111] uppercase">
                    Bonds &amp; Yields
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">US DEBT</span>
              </div>

              <div className="divide-y divide-neutral-100 text-xs">
                {bonds.map((item) => {
                  const isPos = item.change >= 0;
                  return (
                    <div key={item.maturity} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#111111] font-sans">{item.maturity}</div>
                        <div className="text-[10px] text-neutral-400 font-sans">{item.name}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-neutral-900 text-sm">
                          {item.yieldValue.toFixed(2)}%
                        </div>
                        <div
                          className={`text-[11px] font-semibold ${
                            isPos ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {isPos ? "+" : ""}
                          {item.change.toFixed(2)} bps
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 font-mono">
              Constant Maturity US Treasury Securities &bull; CBOE
            </div>
          </div>
        </section>

        {/* Regulatory & Financial Disclosure Footer Ribbon */}
        <section className="p-4 bg-white border border-neutral-200 rounded text-xs text-neutral-500 font-sans space-y-1">
          <div className="font-bold text-neutral-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-neutral-600" />
            <span>Market Data Disclaimer &bull; Financial Editorial Standards</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Market quotes are real-time feeds provided for news reporting, investment reference, and academic analysis. Data is sourced from simulated exchanges and licensed financial wire services. Past equity movements do not guarantee future performance. Before conducting retail or institutional transactions, consult certified financial planners.
          </p>
        </section>
      </main>

      {/* ========================================================= */}
      {/* MODAL: STOCK DETAILS DRAWER                               */}
      {/* ========================================================= */}
      {selectedStock && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedStock(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl border border-neutral-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-200 flex items-start justify-between bg-neutral-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-white border border-neutral-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-1.5">
                  {selectedStock.logoUrl ? (
                    <img
                      src={selectedStock.logoUrl}
                      alt={selectedStock.symbol}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (!img.src.includes("google.com/s2/favicons")) {
                          img.src = `https://www.google.com/s2/favicons?domain=${selectedStock.symbol.toLowerCase()}.com&sz=128`;
                        } else {
                          img.style.display = "none";
                        }
                      }}
                    />
                  ) : (
                    <span className="font-bold text-sm text-[#111111]">{selectedStock.symbol.slice(0, 2)}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#111111] font-sans">
                      {selectedStock.name}
                    </h3>
                    <span className="bg-[#B80000] text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                      Rank #{selectedStock.rank}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">{selectedStock.sector}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStock(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded hover:bg-neutral-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5">
              {/* Price & 24h Change */}
              <div className="flex items-baseline justify-between border-b border-neutral-100 pb-4">
                <div>
                  <div className="text-3xl font-mono font-black text-[#111111]">
                    ${selectedStock.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-neutral-400">USD &bull; Real-time quote</div>
                </div>

                <div className="text-right">
                  <div
                    className={`inline-flex items-center text-sm font-mono font-bold px-2 py-0.5 rounded ${
                      selectedStock.change >= 0
                        ? "text-emerald-800 bg-emerald-100"
                        : "text-red-800 bg-red-100"
                    }`}
                  >
                    {selectedStock.change >= 0 ? "+" : ""}
                    {selectedStock.change.toFixed(2)} ({selectedStock.change >= 0 ? "+" : ""}
                    {selectedStock.changePercent.toFixed(2)}%)
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5 font-mono">24h Net Movement</div>
                </div>
              </div>

              {/* Fundamental Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200">
                  <div className="text-neutral-500 text-[10px] uppercase font-bold">Market Cap</div>
                  <div className="font-mono font-bold text-neutral-900 text-sm mt-0.5">
                    {selectedStock.marketCap}
                  </div>
                </div>

                <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200">
                  <div className="text-neutral-500 text-[10px] uppercase font-bold">P/E Ratio</div>
                  <div className="font-mono font-bold text-neutral-900 text-sm mt-0.5">
                    {selectedStock.peRatio}x
                  </div>
                </div>

                <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200">
                  <div className="text-neutral-500 text-[10px] uppercase font-bold">Div Yield</div>
                  <div className="font-mono font-bold text-neutral-900 text-sm mt-0.5">
                    {selectedStock.dividendYield > 0 ? `${selectedStock.dividendYield}%` : "N/A"}
                  </div>
                </div>

                <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200">
                  <div className="text-neutral-500 text-[10px] uppercase font-bold">Day Range</div>
                  <div className="font-mono font-bold text-neutral-900 mt-0.5 text-[11px]">
                    ${selectedStock.dayLow} &ndash; ${selectedStock.dayHigh}
                  </div>
                </div>

                <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200">
                  <div className="text-neutral-500 text-[10px] uppercase font-bold">52-Wk Range</div>
                  <div className="font-mono font-bold text-neutral-900 mt-0.5 text-[11px]">
                    ${selectedStock.low52w} &ndash; ${selectedStock.high52w}
                  </div>
                </div>

                <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200">
                  <div className="text-neutral-500 text-[10px] uppercase font-bold">Trading Vol</div>
                  <div className="font-mono font-bold text-neutral-900 text-sm mt-0.5">
                    {selectedStock.volume}
                  </div>
                </div>
              </div>

              {/* Company Profile */}
              <div className="bg-neutral-50 p-3.5 rounded border border-neutral-200 text-xs">
                <div className="font-bold text-neutral-800 mb-1">Company Profile &amp; Intelligence</div>
                <p className="text-neutral-600 leading-relaxed font-sans">
                  {selectedStock.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">
                Analyst Consensus: <strong>{selectedStock.recommendation}</strong>
              </span>
              <button
                onClick={() => setSelectedStock(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-[#111111] hover:bg-neutral-800 text-white rounded transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: NEWS STORY PREVIEW                                 */}
      {/* ========================================================= */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-neutral-100">
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="absolute bottom-3 left-3 bg-[#B80000] text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-xs">
                {selectedNews.category}
              </span>
            </div>

            <div className="p-5 space-y-3">
              <div className="text-[11px] text-neutral-400 font-mono">
                {selectedNews.time} &bull; {selectedNews.source}
              </div>
              <h3 className="font-serif font-black text-xl text-[#111111] leading-snug">
                {selectedNews.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                {selectedNews.summary}
              </p>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-[#111111] hover:bg-neutral-800 text-white rounded transition-colors cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
