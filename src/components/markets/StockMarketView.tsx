"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Search,
  RefreshCw,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  X,
  Award,
  Zap,
} from "lucide-react";
import { StockQuote, MarketIndex, MarketStatus, MarketSummary } from "@/types/markets";

type FilterTab = "all" | "gainers" | "losers" | "active" | "tech" | "finance";

export default function StockMarketView() {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchMarketData = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/markets", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setStocks(data.stocks);
        setIndices(data.indices);
        setMarketStatus(data.marketStatus);
        setSummary(data.summary);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to load market data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Periodic auto-refresh every 8 seconds when enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchMarketData, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchMarketData]);

  // Filtered stocks based on tab and search
  const filteredStocks = useMemo(() => {
    let result = [...stocks];

    // Filter by tab
    if (activeTab === "gainers") {
      result = [...result].sort((a, b) => b.changePercent - a.changePercent);
      result = result.filter((s) => s.change > 0);
    } else if (activeTab === "losers") {
      result = [...result].sort((a, b) => a.changePercent - b.changePercent);
      result = result.filter((s) => s.change < 0);
    } else if (activeTab === "active") {
      result = [...result].sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
    } else if (activeTab === "tech") {
      result = result.filter((s) =>
        s.sector.toLowerCase().includes("tech") ||
        s.sector.toLowerCase().includes("software") ||
        s.sector.toLowerCase().includes("semiconductor") ||
        s.sector.toLowerCase().includes("internet")
      );
    } else if (activeTab === "finance") {
      result = result.filter((s) =>
        s.sector.toLowerCase().includes("financial") ||
        s.sector.toLowerCase().includes("banking") ||
        s.sector.toLowerCase().includes("energy") ||
        s.sector.toLowerCase().includes("oil")
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q)
      );
    }

    return result;
  }, [stocks, activeTab, searchQuery]);

  return (
    <>
      {/* 3. Main Markets Canvas (1400px width) */}
      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 space-y-8">
        {/* Page Hero Header */}
        <div className="border-b border-neutral-200 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#B80000] text-white text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs">
                  FINANCIAL WIRE
                </span>
                <span className="text-xs text-neutral-500 font-mono flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <span>TRADING ACTIVE &bull; {marketStatus?.message || "NYSE / NASDAQ EST"}</span>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#1A1A1A]">
                Global Stock Markets &amp; Company Rankings
              </h1>
              <p className="text-sm text-neutral-600 mt-2 max-w-2xl font-serif">
                Real-time stock quotes, market capitalization rankings, high-frequency equity price movements, and corporate intelligence.
              </p>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center gap-2 self-start md:self-end shrink-0">
              <label className="flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer bg-white px-2.5 py-1.5 border border-neutral-300 rounded shadow-2xs select-none">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded text-[#B80000] focus:ring-0 cursor-pointer"
                />
                <span className="font-medium">Live Ticks (8s)</span>
              </label>

              <button
                onClick={fetchMarketData}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#1A1A1A] hover:bg-[#B80000] text-white transition-colors shadow-2xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                <span>{refreshing ? "Updating..." : "Refresh"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Key Indices 4-Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {indices.slice(0, 4).map((idx) => {
            const isPos = idx.change >= 0;
            return (
              <div
                key={idx.symbol}
                className="bg-white p-4 border border-neutral-200 rounded-sm shadow-xs hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-neutral-500 font-medium mb-1">
                  <span className="font-bold text-neutral-800">{idx.symbol}</span>
                  <span className="font-mono text-[10px] uppercase text-neutral-400">{idx.region}</span>
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#1A1A1A]">
                  {idx.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono mt-1 font-semibold">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-xs ${
                      isPos ? "text-emerald-800 bg-emerald-50" : "text-red-800 bg-red-50"
                    }`}
                  >
                    {isPos ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                    {isPos ? "+" : ""}
                    {idx.changePercent.toFixed(2)}%
                  </span>
                  <span className="text-neutral-400 text-[11px]">
                    ({isPos ? "+" : ""}
                    {idx.change.toFixed(2)})
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Market Breadth & Summary Bar */}
        {summary && (
          <div className="bg-white p-4 border border-neutral-200 rounded-sm shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-neutral-400 uppercase text-[10px] block font-bold">Tracked Mega-Caps</span>
                <span className="font-mono font-bold text-neutral-900 text-sm">{summary.totalTrackedCompanies} Companies</span>
              </div>
              <div className="h-6 w-px bg-neutral-200 hidden sm:block"></div>
              <div>
                <span className="text-neutral-400 uppercase text-[10px] block font-bold">Combined Valuation</span>
                <span className="font-mono font-bold text-[#B80000] text-sm">{summary.combinedMarketCap}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Advancing: <strong className="text-emerald-700">{summary.advancingCount}</strong></span>
              </div>
              <span className="text-neutral-300">&bull;</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Declining: <strong className="text-red-700">{summary.decliningCount}</strong></span>
              </div>
              <span className="text-neutral-300">&bull;</span>
              <span className="text-neutral-400 font-sans">
                Tick: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}

        {/* Tab Filters & Search Controls */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
              {[
                { id: "all", label: "All Ranked Stocks", icon: Award },
                { id: "gainers", label: "Top Gainers", icon: TrendingUp },
                { id: "losers", label: "Top Losers", icon: TrendingDown },
                { id: "active", label: "Most Active", icon: Zap },
                { id: "tech", label: "AI & Tech Silicon", icon: Activity },
                { id: "finance", label: "Finance & Energy", icon: Layers },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as FilterTab)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#B80000] text-white shadow-2xs"
                        : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search ticker (AAPL, NVDA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded text-xs focus:outline-none focus:border-[#B80000] font-sans shadow-2xs"
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

        {/* Live Company Stock Ranking Table */}
        <div className="bg-white border border-neutral-200 rounded-sm shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F6F6] text-neutral-600 font-semibold uppercase tracking-wider text-[11px] border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-3 sm:px-4 w-12 text-center">Rank</th>
                  <th className="py-3 px-4">Company &amp; Ticker</th>
                  <th className="py-3 px-4 text-right">Price (USD)</th>
                  <th className="py-3 px-4 text-right">24h Change</th>
                  <th className="py-3 px-4 text-right">Market Cap</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">Volume</th>
                  <th className="py-3 px-4 text-right hidden md:table-cell">Day Range</th>
                  <th className="py-3 px-4 text-center hidden lg:table-cell">7-Day Trend</th>
                  <th className="py-3 px-4 text-center">Analyst</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                {loading && stocks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-neutral-400 font-sans">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#B80000]" />
                      Loading live equity feeds...
                    </td>
                  </tr>
                ) : filteredStocks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-neutral-500 font-sans">
                      No stock matching &ldquo;{searchQuery}&rdquo; found.
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map((stock) => {
                    const isPos = stock.change >= 0;
                    return (
                      <tr
                        key={stock.symbol}
                        onClick={() => setSelectedStock(stock)}
                        className="hover:bg-neutral-50/90 transition-colors cursor-pointer group"
                      >
                        {/* Rank */}
                        <td className="py-3 px-3 sm:px-4 text-center font-bold text-neutral-400 group-hover:text-[#B80000]">
                          #{stock.rank}
                        </td>

                        {/* Company Name & Symbol */}
                        <td className="py-3 px-4">
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
                              <div className="font-bold text-neutral-900 group-hover:text-[#B80000] transition-colors flex items-center gap-1.5 font-sans text-sm">
                                <span>{stock.name}</span>
                                <span className="font-mono text-xs text-neutral-400">({stock.symbol})</span>
                              </div>
                              <div className="text-[11px] text-neutral-500 font-sans">
                                {stock.sector}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Live Stock Price */}
                        <td className="py-3 px-4 text-right font-bold text-neutral-900 text-sm">
                          ${stock.price.toFixed(2)}
                        </td>

                        {/* 24h Change */}
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-semibold ${
                              isPos
                                ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                                : "text-red-800 bg-red-50 border border-red-200"
                            }`}
                          >
                            {isPos ? "+" : ""}
                            {stock.change.toFixed(2)} ({isPos ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%)
                          </span>
                        </td>

                        {/* Market Cap */}
                        <td className="py-3 px-4 text-right font-bold text-neutral-800">
                          {stock.marketCap}
                        </td>

                        {/* Volume */}
                        <td className="py-3 px-4 text-right text-neutral-600 hidden sm:table-cell">
                          {stock.volume}
                        </td>

                        {/* Day Range */}
                        <td className="py-3 px-4 text-right text-neutral-500 text-[11px] hidden md:table-cell">
                          ${stock.dayLow.toFixed(1)} &ndash; ${stock.dayHigh.toFixed(1)}
                        </td>

                        {/* Mini Sparkline Chart */}
                        <td className="py-3 px-4 text-center hidden lg:table-cell">
                          <div className="w-20 h-6 mx-auto flex items-center justify-center">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                              <polyline
                                fill="none"
                                stroke={isPos ? "#16a34a" : "#dc2626"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={stock.sparkline
                                  .map((val, idx) => {
                                    const min = Math.min(...stock.sparkline);
                                    const max = Math.max(...stock.sparkline);
                                    const range = max - min || 1;
                                    const x = (idx / (stock.sparkline.length - 1)) * 90 + 5;
                                    const y = 25 - ((val - min) / range) * 20;
                                    return `${x},${y}`;
                                  })
                                  .join(" ")}
                              />
                            </svg>
                          </div>
                        </td>

                        {/* Analyst Recommendation */}
                        <td className="py-3 px-4 text-center font-sans">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              stock.recommendation === "Strong Buy"
                                ? "bg-emerald-100 text-emerald-800"
                                : stock.recommendation === "Buy"
                                ? "bg-blue-100 text-blue-800"
                                : stock.recommendation === "Hold"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {stock.recommendation}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Disclosure Disclaimer */}
        <div className="p-4 bg-white border border-neutral-200 rounded text-xs text-neutral-500 font-sans space-y-1">
          <div className="font-bold text-neutral-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-neutral-600" />
            <span>Market Data &amp; Editorial Intelligence Disclaimer</span>
          </div>
          <p>
            Real-time market feeds provided for editorial reporting and analytical reference. Quotes are updated dynamically via simulated exchange ticks. Historical performance does not guarantee future results. Consult licensed financial advisors prior to capital execution.
          </p>
        </div>
      </main>

      {/* 4. Stock Details Modal Drawer */}
      {selectedStock && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedStock(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl border border-neutral-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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
                    <h3 className="text-base font-bold text-neutral-900">
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
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded hover:bg-neutral-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5">
              {/* Live Price Row */}
              <div className="flex items-baseline justify-between border-b border-neutral-100 pb-4">
                <div>
                  <div className="text-3xl font-mono font-black text-neutral-900">
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
                  <div className="text-[11px] text-neutral-400 mt-0.5">24h Net Movement</div>
                </div>
              </div>

              {/* Key Statistics Grid */}
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

              {/* Company Description */}
              <div className="bg-neutral-50 p-3.5 rounded border border-neutral-200 text-xs">
                <div className="font-bold text-neutral-800 mb-1">Company Profile &amp; Intelligence</div>
                <p className="text-neutral-600 leading-relaxed font-sans">
                  {selectedStock.description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">
                Consensus: <strong>{selectedStock.recommendation}</strong>
              </span>
              <button
                onClick={() => setSelectedStock(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-[#1A1A1A] hover:bg-neutral-800 text-white rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
