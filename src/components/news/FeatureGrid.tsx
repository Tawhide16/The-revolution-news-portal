import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronRight } from "lucide-react";
import { SECONDARY_FEATURE_CARDS, HORIZONTAL_CARD_ROW } from "@/data/mockNews";

export default function FeatureGrid() {
  return (
    <section className="py-8 border-b border-[#E2E2E2] space-y-8">
      {/* 2 Wide Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECONDARY_FEATURE_CARDS.map((card) => (
          <article
            key={card.id}
            className="group bg-[#FAFAFA] border border-[#E2E2E2] overflow-hidden flex flex-col justify-between"
          >
            <Link
              href={`/article/${card.slug}`}
              className="block relative aspect-[16/9] w-full overflow-hidden bg-neutral-100"
            >
              <Image
                src={card.coverImage}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#1A1A1A] text-white text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider">
                {card.category.name}
              </div>
            </Link>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <Link href={`/article/${card.slug}`}>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-snug">
                    {card.title}
                  </h3>
                </Link>
                <p className="text-sm text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                  {card.summary}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500 font-medium pt-4 mt-4 border-t border-neutral-200">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {card.timeAgo}
                </span>
                <span className="text-neutral-400">By {card.author.name}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Row of 5 Horizontal Story Cards */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b-2 border-[#1A1A1A] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#B80000]"></span>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A] tracking-tight uppercase">
              Top Developments &bull; Global Wire
            </h3>
          </div>
          <Link
            href="/category/world"
            className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#B80000] flex items-center gap-1 transition-colors"
          >
            <span>Full Wire</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {HORIZONTAL_CARD_ROW.map((item) => (
            <article key={item.id} className="group flex flex-col">
              <Link
                href={`/article/${item.slug}`}
                className="block relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 mb-2"
              >
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <Link href={`/article/${item.slug}`}>
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-tight line-clamp-3">
                    {item.title}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-medium pt-2 mt-auto">
                  <span className="text-[#B80000] font-semibold uppercase">{item.category.name}</span>
                  <span>&bull;</span>
                  <span>{item.timeAgo}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
