import Link from "next/link";
import Image from "next/image";
import { ChevronRight, TrendingUp } from "lucide-react";
import { CATEGORY_BLOCKS, MOST_READ_ARTICLES } from "@/data/mockNews";
import NewsletterForm from "./NewsletterForm";

export default function CategoryGridSection() {
  return (
    <section className="py-8 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Left Area: Category Blocks (8 cols on large) */}
        <div className="lg:col-span-8 space-y-10">
          {CATEGORY_BLOCKS.map((block) => (
            <div key={block.category} className="border-b border-[#E2E2E2] pb-8 last:border-b-0">
              {/* Category Header */}
              <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#B80000]"></span>
                  <h3 className="font-serif font-bold text-xl text-[#1A1A1A] uppercase tracking-tight">
                    {block.category}
                  </h3>
                </div>
                <Link
                  href={`/category/${block.slug}`}
                  className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#B80000] flex items-center gap-1 transition-colors"
                >
                  <span>More {block.category}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Category Content: 1 Lead Story + 3 Headlines */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Lead Story (7 cols) */}
                <article className="md:col-span-7 group">
                  <Link
                    href={`/article/${block.lead.slug}`}
                    className="block relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3"
                  >
                    <Image
                      src={block.lead.coverImage}
                      alt={block.lead.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <Link href={`/article/${block.lead.slug}`}>
                    <h4 className="font-serif font-bold text-lg sm:text-xl text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-snug">
                      {block.lead.title}
                    </h4>
                  </Link>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                    {block.lead.summary}
                  </p>
                  <span className="text-[11px] text-neutral-400 font-medium block mt-2">
                    {block.lead.timeAgo}
                  </span>
                </article>

                {/* 3 Secondary Headlines (5 cols) */}
                <div className="md:col-span-5 flex flex-col justify-between divide-y divide-[#E2E2E2]">
                  {block.items.map((item) => (
                    <article key={item.id} className="py-3 first:pt-0 last:pb-0 group">
                      <Link href={`/article/${item.slug}`}>
                        <h5 className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-snug">
                          {item.title}
                        </h5>
                      </Link>
                      <span className="text-[11px] text-neutral-500 font-medium block mt-1.5">
                        {item.timeAgo}
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar: Most Read / Trending (4 cols on large) */}
        <aside className="lg:col-span-4 lg:pl-6 lg:border-l lg:border-[#E2E2E2]">
          <div className="sticky top-28 space-y-6">
            <div className="border-b-2 border-[#1A1A1A] pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#B80000]" />
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A] uppercase tracking-tight">
                  Most Read
                </h3>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Live 24h
              </span>
            </div>

            <ol className="divide-y divide-[#E2E2E2]">
              {MOST_READ_ARTICLES.map((article) => (
                <li key={article.rank} className="py-4 first:pt-0 group flex items-start gap-4">
                  <span className="font-serif font-black text-3xl sm:text-4xl text-[#B80000]/30 group-hover:text-[#B80000] transition-colors shrink-0 w-8 text-right">
                    {article.rank}
                  </span>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B80000] block mb-1">
                      {article.category}
                    </span>
                    <Link href={`/article/${article.slug}`}>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-snug">
                        {article.title}
                      </h4>
                    </Link>
                    <span className="text-[11px] text-neutral-400 font-medium block mt-1">
                      {article.views.toLocaleString()} readers
                    </span>
                  </div>
                </li>
              ))}
            </ol>

            {/* Newsletter Subscription Box */}
            <div className="bg-[#F2F2F2] p-5 border border-neutral-300 rounded-sm mt-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B80000] block mb-1">
                The Morning Briefing
              </span>
              <h4 className="font-serif font-bold text-base text-[#1A1A1A] mb-2">
                Get essential global analysis delivered to your inbox every dawn.
              </h4>
              <p className="text-xs text-neutral-600 mb-3">
                Curated by senior correspondents. Uncompromising editorial independence.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </aside>

      </div>
    </section>
  );
}
