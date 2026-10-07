import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreakingTicker from "@/components/layout/BreakingTicker";
import { getDb } from "@/lib/store";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const db = getDb();
  const category = db.categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const articles = db.articles.filter(
    (a) => a.categoryId === category.id && a.status === "PUBLISHED"
  );

  const lead = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-sans selection:bg-[#B80000] selection:text-white">
      <Header />
      <BreakingTicker />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Category Header */}
        <div className="border-b-4 border-[#B80000] pb-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] uppercase tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>

        {articles.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 font-serif">
            No published articles in this category yet. Check back soon.
          </div>
        ) : (
          <div className="space-y-10">
            {/* Lead Story */}
            {lead && (
              <article className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E2E2E2] group">
                <div className="md:col-span-7">
                  <Link
                    href={`/article/${lead.slug}`}
                    className="block relative aspect-[16/10] overflow-hidden bg-neutral-100"
                  >
                    <Image
                      src={lead.coverImage}
                      alt={lead.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
                <div className="md:col-span-5 flex flex-col justify-center space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B80000]">
                    Lead Story
                  </span>
                  <Link href={`/article/${lead.slug}`}>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-tight">
                      {lead.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {lead.summary}
                  </p>
                  <span className="text-xs text-neutral-400 font-medium pt-2 block">
                    By {lead.authorName}
                  </span>
                </div>
              </article>
            )}

            {/* Grid of Remaining Articles */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((art) => (
                  <article key={art.id} className="group flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/article/${art.slug}`}
                        className="block relative aspect-[16/10] overflow-hidden bg-neutral-100 mb-3"
                      >
                        <Image
                          src={art.coverImage}
                          alt={art.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <Link href={`/article/${art.slug}`}>
                        <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-snug">
                          {art.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-medium pt-3 mt-4 border-t border-neutral-100">
                      <span>By {art.authorName}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
