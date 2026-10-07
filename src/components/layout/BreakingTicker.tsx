import Link from "next/link";
import { Zap } from "lucide-react";
import { BREAKING_NEWS } from "@/data/mockNews";

export default function BreakingTicker() {
  if (!BREAKING_NEWS.length) return null;
  const current = BREAKING_NEWS[0];

  return (
    <div className="bg-[#B80000] text-white py-2 px-4 text-sm font-medium">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="bg-black/25 uppercase px-2 py-0.5 text-xs font-bold tracking-wider rounded-sm flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-300" /> Breaking
          </span>
        </div>

        <div className="flex-1 overflow-hidden truncate">
          <Link
            href={`/article/${current.slug}`}
            className="hover:underline font-serif text-white tracking-wide truncate block"
          >
            {current.title}
          </Link>
        </div>

        <div className="text-xs text-white/80 shrink-0 font-sans hidden md:block">
          {current.timeAgo} &bull; {current.category}
        </div>
      </div>
    </div>
  );
}
