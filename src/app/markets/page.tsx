import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StockMarketView from "@/components/markets/StockMarketView";

export const metadata = {
  title: "Live Stock Market & Company Rankings | The Revolution",
  description:
    "Real-time stock quotes, market capitalization rankings, high-frequency equity price movements, and corporate intelligence.",
};

export default function StockMarketPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#B80000] selection:text-white">
      {/* 1. Header Navigation */}
      <Header />

      {/* 2. Main Markets Canvas & Interactive Table */}
      <StockMarketView />

      {/* 3. Editorial Multi-Column Footer */}
      <Footer />
    </div>
  );
}
