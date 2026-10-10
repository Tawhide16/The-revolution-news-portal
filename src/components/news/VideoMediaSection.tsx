import Link from "next/link";
import Image from "next/image";
import { Play, Tv } from "lucide-react";
import { VIDEO_STORIES } from "@/data/mockNews";

export default function VideoMediaSection() {
  return (
    <section className="bg-[#121212] text-white py-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 my-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <span className="bg-[#B80000] p-1.5 rounded-sm flex items-center justify-center">
              <Tv className="w-4 h-4 text-white" />
            </span>
            <h3 className="font-serif font-bold text-xl tracking-wide uppercase text-white">
              Watch &bull; Visual Journalism
            </h3>
          </div>
          <span className="text-xs uppercase font-semibold text-neutral-400 tracking-wider">
            Curated Documentaries
          </span>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VIDEO_STORIES.map((video) => (
            <article key={video.id} className="group flex flex-col">
              <Link
                href={`/article/${video.slug}`}
                className="block relative aspect-[16/9] w-full overflow-hidden bg-neutral-900 mb-3 rounded-sm"
              >
                <Image
                  src={video.coverImage}
                  alt={video.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                {/* Play Button Overlay & Duration */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#B80000] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {video.videoDuration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded-sm font-semibold">
                    {video.videoDuration}
                  </div>
                )}
              </Link>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[#B80000] text-[11px] font-bold uppercase tracking-wider block mb-1">
                    {video.category.name}
                  </span>
                  <Link href={`/article/${video.slug}`}>
                    <h4 className="font-serif font-bold text-base text-white group-hover:text-red-400 transition-colors leading-snug line-clamp-2">
                      {video.title}
                    </h4>
                  </Link>
                </div>
                <div className="text-[11px] text-neutral-400 pt-2 mt-auto">
                  {video.timeAgo} &bull; {video.views.toLocaleString()} views
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
