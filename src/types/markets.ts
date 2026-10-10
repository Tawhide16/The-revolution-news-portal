export interface StockQuote {
  rank: number;
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  marketCapNumber: number; // in billions
  volume: string;
  high52w: number;
  low52w: number;
  peRatio: number;
  dividendYield: number;
  dayHigh: number;
  dayLow: number;
  sparkline: number[];
  recommendation: "Strong Buy" | "Buy" | "Hold" | "Sell";
  description: string;
  logoUrl?: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  region: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  sparkline?: number[];
}

export interface MarketSummary {
  gainersCount: number;
  losersCount: number;
  unchangedCount: number;
  totalMarketCapTrillions: number;
  topGainer: StockQuote | null;
  topLoser: StockQuote | null;
  volLeader: StockQuote | null;
}

export interface MarketStatus {
  isOpen: boolean;
  session: string;
  nextEvent: string;
  message: string;
  timestamp: string;
}

export interface SectorPerformance {
  name: string;
  performancePercent: number;
  marketWeight: string;
  leader: string;
  leaderChange: number;
}

export interface CommodityQuote {
  symbol: string;
  name: string;
  category: "Energy" | "Metals" | "Agriculture";
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
}

export interface CurrencyQuote {
  symbol: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  isCrypto?: boolean;
}

export interface BondYield {
  maturity: string;
  name: string;
  yieldValue: number;
  change: number;
  previousClose: number;
}

export interface MarketNewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  imageUrl: string;
  category: string;
  summary: string;
  url?: string;
}
