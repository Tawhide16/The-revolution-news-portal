import Header from "@/components/layout/Header";
import BreakingTicker from "@/components/layout/BreakingTicker";
import HeroSection from "@/components/news/HeroSection";
import FeatureGrid from "@/components/news/FeatureGrid";
import VideoMediaSection from "@/components/news/VideoMediaSection";
import CategoryGridSection from "@/components/news/CategoryGridSection";
import FourColumnGrid from "@/components/news/FourColumnGrid";
import Footer from "@/components/layout/Footer";

export const revalidate = 60;

export default async function PublicHomePage() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-sans selection:bg-[#B80000] selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Breaking News Ticker */}
      <BreakingTicker />

      {/* Main Public Content Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Row 1: Hero Section (3-column BBC broadsheet grid) */}
        <HeroSection />

        {/* Row 2 & 3: Secondary 2-split feature cards & 5-item horizontal wire */}
        <FeatureGrid />

        {/* Row 4: High-contrast Dark Multimedia & Video Section */}
        <VideoMediaSection />

        {/* Row 5: 4-Column Thematic Category Grid */}
        <FourColumnGrid />

        {/* Row 6: Category Lead Blocks + Most Read Sidebar */}
        <CategoryGridSection />
      </main>

      {/* BBC-Style Editorial Footer */}
      <Footer />
    </div>
  );
}
