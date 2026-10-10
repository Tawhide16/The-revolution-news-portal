import Link from "next/link";
import { Zap } from "lucide-react";
import { getDb } from "@/lib/store";

export default function BreakingTicker() {
  const db = getDb();
  const settings = db.settings;

  if (!settings?.breakingEnabled) return null;

  // Find breaking article or fallback to custom text
  const breakingArticle = db.articles.find(
    (a) => a.breaking && a.status === "PUBLISHED"
  );

  const headline =
    settings.breakingCustomText ||
    breakingArticle?.title ||
    "Global leaders reach emergency climate accord after marathon negotiations in Geneva";

  const targetUrl =
    settings.breakingUrl ||
    (breakingArticle ? `/article/${breakingArticle.slug}` : "#");

  return (
    <div className="bg-[#B80000] text-white py-2 px-4 text-sm font-medium">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
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
            href={targetUrl}
            className="hover:underline font-serif text-white tracking-wide truncate block"
          >
            {headline}
          </Link>
        </div>

        <div className="text-xs text-white/80 shrink-0 font-sans hidden md:block">
          Live Wire &bull; Editorial Alert
        </div>
      </div>
    </div>
  );
}
