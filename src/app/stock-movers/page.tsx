import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StockMoversClient from "@/components/markets/StockMoversClient";

export const metadata = {
  title: "Stock Movers & Top Market Data | The Revolution",
  description:
    "Live stock movers, top percentage gainers, losers, most active equities, world markets map, sector summary, commodities, forex, and bonds intelligence.",
};

export default function StockMoversPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#B80000] selection:text-white">
      {/* 1. Portal Navigation Header */}
      <Header />

      {/* 2. Main Stock Movers Canvas */}
      <StockMoversClient />

      {/* 3. Comprehensive Editorial Dark Footer */}
      <Footer />
    </div>
  );
}
