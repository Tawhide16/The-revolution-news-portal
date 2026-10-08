import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreakingTicker from "@/components/layout/BreakingTicker";
import { getDb } from "@/lib/store";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, User, Share2, Tag, ChevronRight, Eye, Layout, Smartphone, Monitor } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const db = getDb();
  const article = db.articles.find(
    (a) => (a.slug === params.slug || a.id === params.slug) && a.status === "PUBLISHED"
  );

  if (!article) {
    notFound();
  }

  const layout = article.layout || "standard";
  const targetDevice = article.targetDevice || "both";

  // Related articles from same category
  const related = db.articles
    .filter((a) => a.categoryId === article.categoryId && a.id !== article.id && a.status === "PUBLISHED")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-sans selection:bg-[#B80000] selection:text-white">
      <Header />
      <BreakingTicker />

      {/* HERO BANNER LAYOUT */}
      {layout === "hero" && article.coverImage ? (
        <div>
          {/* Immersive Top Visual Banner */}
          <div className="relative w-full h-[60vh] min-h-[420px] bg-neutral-900">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white">
              <nav className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-300 mb-3">
                <Link href="/" className="hover:text-white">Home</Link>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <Link href={`/category/${article.categorySlug}`} className="text-red-400 font-bold hover:underline">
                  {article.categoryName}
                </Link>
              </nav>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black leading-tight text-white mb-4 drop-shadow-md">
                {article.title}
              </h1>

              <p className="text-lg sm:text-xl text-neutral-200 font-sans leading-relaxed max-w-3xl font-light">
                {article.summary}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-neutral-300">
                <span className="font-semibold text-white flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-red-400" /> By {article.authorName}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Recently"}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {(article.views || 0).toLocaleString()} views
                </span>
              </div>
            </div>
          </div>

          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
            <div
              className="prose prose-neutral max-w-none font-serif text-base sm:text-lg leading-relaxed text-[#1A1A1A] space-y-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags & Related */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-8 mt-10 border-t border-[#E2E2E2]">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">Related Topics</span>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span key={tag} className="bg-[#F2F2F2] hover:bg-neutral-200 text-neutral-800 text-xs px-3 py-1 font-medium">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {related.length > 0 && renderRelatedStories(related, article.categoryName)}
          </main>
        </div>
      ) : (
        /* STANDARD, TWO-COLUMN, OR MINIMAL LAYOUT */
        <main
          className={`flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full ${
            layout === "minimal" ? "max-w-2xl" : "max-w-4xl"
          }`}
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-neutral-500 uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-[#B80000]">Home</Link>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <Link href={`/category/${article.categorySlug}`} className="hover:text-[#B80000] font-semibold text-[#B80000]">
              {article.categoryName}
            </Link>
          </nav>

          {/* Headline */}
          <h1
            className={`font-serif font-bold text-[#1A1A1A] leading-tight mb-4 ${
              layout === "minimal"
                ? "text-3xl sm:text-4xl text-center"
                : "text-3xl sm:text-4xl lg:text-5xl"
            }`}
          >
            {article.title}
          </h1>

          {/* Lead Excerpt */}
          <p
            className={`text-neutral-600 font-sans leading-relaxed mb-6 font-normal ${
              layout === "minimal"
                ? "text-base sm:text-lg text-center italic"
                : "text-lg sm:text-xl"
            }`}
          >
            {article.summary}
          </p>

          {/* Byline & Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#E2E2E2] mb-8 text-xs text-neutral-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                <User className="w-3.5 h-3.5 text-[#B80000]" />
                <span>By {article.authorName}</span>
              </div>
              <span>&bull;</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Just now"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-neutral-400">
                <Eye className="w-3.5 h-3.5" /> {(article.views || 0).toLocaleString()} views
              </span>
            </div>
          </div>

          {/* Cover Image */}
          {article.coverImage && (
            <figure className="mb-10">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 rounded-xs">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-xs text-neutral-500 mt-2 italic text-right">
                Photo: The Revolution Editorial Wire
              </figcaption>
            </figure>
          )}

          {/* Article HTML Content according to layout */}
          <div
            className={`prose prose-neutral max-w-none font-serif leading-relaxed text-[#1A1A1A] space-y-6 ${
              layout === "two-column"
                ? "text-sm sm:text-base sm:columns-2 gap-8 text-justify"
                : layout === "minimal"
                ? "text-lg max-w-2xl mx-auto"
                : "text-base sm:text-lg"
            }`}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-8 mt-10 border-t border-[#E2E2E2]">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                Related Topics
              </span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#F2F2F2] hover:bg-neutral-200 text-neutral-800 text-xs px-3 py-1 font-medium transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Coverage */}
          {related.length > 0 && renderRelatedStories(related, article.categoryName)}
        </main>
      )}

      <Footer />
    </div>
  );
}

function renderRelatedStories(related: any[], categoryName: string) {
  return (
    <div className="pt-10 mt-12 border-t-2 border-[#1A1A1A]">
      <h3 className="font-serif font-bold text-xl text-[#1A1A1A] mb-6">
        More from {categoryName}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {related.map((item) => (
          <article key={item.id} className="group">
            <Link
              href={`/article/${item.slug}`}
              className="block relative aspect-[16/10] overflow-hidden bg-neutral-100 mb-2"
            >
              <Image
                src={item.coverImage}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <Link href={`/article/${item.slug}`}>
              <h4 className="font-serif font-bold text-sm text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-snug line-clamp-2">
                {item.title}
              </h4>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
