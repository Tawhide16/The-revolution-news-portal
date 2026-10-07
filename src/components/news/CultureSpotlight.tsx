import Link from "next/link";
import Image from "next/image";

export default function CultureSpotlight() {
  return (
    <section className="py-8 border-b border-[#E2E2E2] space-y-6">
      <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#B80000]"></span>
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A] uppercase tracking-tight">
            Culture &bull; Archival &amp; Long Reads
          </h3>
        </div>
        <Link
          href="/category/entertainment"
          className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#B80000] transition-colors"
        >
          More In-Depth &rarr;
        </Link>
      </div>

      {/* Main Archival Lead Banner (B&W aesthetic from screenshot) */}
      <article className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FAFAFA] border border-[#E2E2E2] p-5 group">
        <div className="md:col-span-7">
          <Link
            href="/article/historic-peace-treaty-signed-border-talks-conclude"
            className="block relative aspect-[16/10] overflow-hidden bg-neutral-200"
          >
            <Image
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80"
              alt="Historical photojournalism archives"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </div>

        <div className="md:col-span-5 flex flex-col justify-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#B80000]">
            Photojournalism &bull; Retrospective
          </span>
          <Link href="/article/historic-peace-treaty-signed-border-talks-conclude">
            <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-tight">
              The Unseen Photographs That Documented a Century of Silent Revolutions
            </h4>
          </Link>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Recently declassified glass-plate negatives from national archives reveal candid moments from early twentieth-century working-class movements.
          </p>
          <span className="text-[11px] text-neutral-400 font-medium pt-2 block">
            By Julian Thorne &bull; 8 min read
          </span>
        </div>
      </article>

      {/* 3 Sub-feature photo cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <article className="group">
          <Link
            href="/article/clean-fusion-reactor-sustains-net-energy-plasma"
            className="block relative aspect-[16/10] overflow-hidden bg-neutral-100 mb-2"
          >
            <Image
              src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=500&q=80"
              alt="Modern art restoration"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <Link href="/article/clean-fusion-reactor-sustains-net-energy-plasma">
            <h5 className="font-serif font-bold text-sm text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-snug">
              How AI Algorithms are Reconstructing Lost Renaissance Masterpieces
            </h5>
          </Link>
          <span className="text-[10px] text-neutral-400 font-medium block mt-1">4 hrs ago</span>
        </article>

        <article className="group">
          <Link
            href="/article/supreme-court-landmark-ruling-algorithmic-privacy"
            className="block relative aspect-[16/10] overflow-hidden bg-neutral-100 mb-2"
          >
            <Image
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80"
              alt="Architecture showcase"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <Link href="/article/supreme-court-landmark-ruling-algorithmic-privacy">
            <h5 className="font-serif font-bold text-sm text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-snug">
              The Radical Geometry Reshaping Scandinavian Civic Libraries
            </h5>
          </Link>
          <span className="text-[10px] text-neutral-400 font-medium block mt-1">6 hrs ago</span>
        </article>

        <article className="group">
          <Link
            href="/article/inside-high-altitude-seed-vault-biodiversity"
            className="block relative aspect-[16/10] overflow-hidden bg-neutral-100 mb-2"
          >
            <Image
              src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=500&q=80"
              alt="Arctic expedition"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <Link href="/article/inside-high-altitude-seed-vault-biodiversity">
            <h5 className="font-serif font-bold text-sm text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-snug">
              Soundscapes of the Deep: Hydrophones Record the Singing of Whales
            </h5>
          </Link>
          <span className="text-[10px] text-neutral-400 font-medium block mt-1">9 hrs ago</span>
        </article>
      </div>
    </section>
  );
}
