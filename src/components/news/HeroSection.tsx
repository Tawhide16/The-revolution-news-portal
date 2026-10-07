import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { HERO_STORIES } from "@/data/mockNews";

export default function HeroSection() {
  const { lead, leftStories, rightStories } = HERO_STORIES;

  return (
    <section className="py-6 border-b border-[#E2E2E2]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 lg:divide-x lg:divide-[#E2E2E2]">
        
        {/* Left Column (2 Stories) - 3 cols on large */}
        <div className="lg:col-span-3 lg:pr-6 space-y-6">
          {leftStories.map((story) => (
            <article key={story.id} className="group flex flex-col space-y-2">
              <Link href={`/article/${story.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="pt-1">
                <Link href={`/article/${story.slug}`}>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1A1A1A] leading-snug group-hover:text-[#B80000] transition-colors">
                    {story.title}
                  </h3>
                </Link>
                <p className="text-xs text-neutral-600 line-clamp-2 mt-1.5 leading-relaxed">
                  {story.summary}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-500 font-medium">
                  <span className="text-[#B80000] font-semibold uppercase">{story.category.name}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {story.timeAgo}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Center Main Lead Story - 6 cols on large */}
        <div className="lg:col-span-6 lg:px-6">
          <article className="group">
            <Link href={`/article/${lead.slug}`} className="block relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 mb-4">
              <Image
                src={lead.coverImage}
                alt={lead.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#B80000] text-white text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  Lead Story
                </span>
                <span className="text-xs font-semibold text-neutral-600 uppercase">
                  {lead.category.name}
                </span>
                <span className="text-xs text-neutral-400">&bull;</span>
                <span className="text-xs text-neutral-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {lead.timeAgo}
                </span>
              </div>

              <Link href={`/article/${lead.slug}`}>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1A1A1A] leading-tight group-hover:text-[#B80000] transition-colors">
                  {lead.title}
                </h2>
              </Link>

              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-sans">
                {lead.summary}
              </p>

              {lead.relatedBullets && lead.relatedBullets.length > 0 && (
                <div className="pt-3 border-t border-neutral-200 mt-4 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Related Coverage
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm font-medium">
                    {lead.relatedBullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#B80000] font-bold">&bull;</span>
                        <Link href={`/article/${lead.slug}`} className="text-neutral-800 hover:text-[#B80000] hover:underline">
                          {bullet}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>
        </div>

        {/* Right Column (3 Stories) - 3 cols on large */}
        <div className="lg:col-span-3 lg:pl-6 space-y-5">
          {rightStories.map((story, idx) => (
            <article
              key={story.id}
              className={`group flex gap-3 lg:flex-col ${
                idx !== 0 ? "pt-4 border-t border-neutral-200" : ""
              }`}
            >
              <div className="w-1/3 lg:w-full shrink-0">
                <Link href={`/article/${story.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <Image
                    src={story.coverImage}
                    alt={story.title}
                    fill
                    sizes="(max-width: 1024px) 30vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>

              <div className="w-2/3 lg:w-full space-y-1">
                <Link href={`/article/${story.slug}`}>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A] leading-snug group-hover:text-[#B80000] transition-colors">
                    {story.title}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium pt-1">
                  <span className="text-[#B80000] font-semibold uppercase">{story.category.name}</span>
                  <span>&bull;</span>
                  <span>{story.timeAgo}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
