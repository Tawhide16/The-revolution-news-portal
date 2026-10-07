import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreakingTicker from "@/components/layout/BreakingTicker";
import { getDb } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q || "").toLowerCase().trim();
  const db = getDb();

  const results = query
    ? db.articles.filter(
        (a) =>
          a.status === "PUBLISHED" &&
          (a.title.toLowerCase().includes(query) ||
            a.summary.toLowerCase().includes(query) ||
            a.content.toLowerCase().includes(query) ||
            a.tags?.some((t) => t.toLowerCase().includes(query)))
      )
    : [];

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-sans selection:bg-[#B80000] selection:text-white">
      <Header />
      <BreakingTicker />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="border-b-2 border-[#1A1A1A] pb-4 mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">
            Search Journalism Archive
          </h1>
          {query && (
            <p className="text-sm text-neutral-500 mt-1">
              Found {results.length} result(s) for &ldquo;<strong className="text-black">{query}</strong>&rdquo;
            </p>
          )}
        </div>

        {/* Search Input Bar */}
        <form action="/search" method="GET" className="mb-10 max-w-xl flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search topics, headlines, authors..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#B80000] hover:bg-[#950000] text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Search
          </button>
        </form>

        {query && results.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 font-serif">
            No published articles matched your search. Try different keywords.
          </div>
        ) : (
          <div className="space-y-6 divide-y divide-[#E2E2E2]">
            {results.map((art) => (
              <article key={art.id} className="pt-6 first:pt-0 group grid grid-cols-1 sm:grid-cols-12 gap-6">
                <div className="sm:col-span-8 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#B80000]">
                    {art.categoryName}
                  </div>
                  <Link href={`/article/${art.slug}`}>
                    <h2 className="text-xl font-serif font-bold text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-snug">
                      {art.title}
                    </h2>
                  </Link>
                  <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                  <span className="text-[11px] text-neutral-400 font-medium block">
                    By {art.authorName} &bull; {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : ""}
                  </span>
                </div>

                <div className="sm:col-span-4">
                  <Link
                    href={`/article/${art.slug}`}
                    className="block relative aspect-[16/10] overflow-hidden bg-neutral-100"
                  >
                    <Image
                      src={art.coverImage}
                      alt={art.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
