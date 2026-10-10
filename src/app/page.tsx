import Header from "@/components/layout/Header";
import BreakingTicker from "@/components/layout/BreakingTicker";
import HeroSection from "@/components/news/HeroSection";
import FeatureGrid from "@/components/news/FeatureGrid";
import VideoMediaSection from "@/components/news/VideoMediaSection";
import CultureSpotlight from "@/components/news/CultureSpotlight";
import FourColumnGrid from "@/components/news/FourColumnGrid";
import CategoryGridSection from "@/components/news/CategoryGridSection";
import Footer from "@/components/layout/Footer";

export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-sans selection:bg-[#B80000] selection:text-white">
      {/* 1. BBC-style Header Navigation */}
      <Header />

      {/* 2. Red Breaking News Pulse Ticker */}
      <BreakingTicker />

      {/* 3. Main Editorial Broadsheet Canvas (1400px max width) */}
      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Row 1: 3-Column Broadsheet Hero (Lead + Left 2 + Right 3) */}
        <HeroSection />

        {/* Row 2 & 3: Secondary 2-Split Cards & 5-Card Global Wire Strip */}
        <FeatureGrid />

        {/* Row 4: High-Impact Dark Multimedia & Video Journalism */}
        <VideoMediaSection />

        {/* Row 5: Archival, Culture & In-Depth Photography Spotlight */}
        <CultureSpotlight />

        {/* Row 6: 4-Column Thematic Grid (World, Politics, Tech, Culture) */}
        <FourColumnGrid />

        {/* Row 7: Category Lead Blocks + Ranked 1-5 Most Read Sidebar */}
        <CategoryGridSection />
      </main>

      {/* 4. Multi-column Editorial Footer */}
      <Footer />
    </div>
  );
}
