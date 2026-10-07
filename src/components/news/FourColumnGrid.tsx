import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    category: "World",
    slug: "world",
    lead: {
      title: "Alpine Glaciers Recede at Twice Forecast Rate",
      slug: "alpine-glaciers-recede-twice-forecast-rate",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80",
      time: "3 hrs ago",
    },
    links: [
      { title: "Mediterranean water levels reach historic highs", slug: "mediterranean-water-levels", time: "5 hrs ago" },
      { title: "Diplomats meet in Rome for bilateral security accord", slug: "diplomats-meet-rome", time: "8 hrs ago" },
    ],
  },
  {
    category: "Politics",
    slug: "politics",
    lead: {
      title: "Cabinet Approves Historic Digital Bill of Rights",
      slug: "cabinet-approves-digital-bill-of-rights",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=500&q=80",
      time: "2 hrs ago",
    },
    links: [
      { title: "Cross-party coalition debates fiscal deficit measures", slug: "coalition-debates-deficit", time: "4 hrs ago" },
      { title: "Electoral reform panel issues preliminary recommendations", slug: "electoral-reform-panel", time: "7 hrs ago" },
    ],
  },
  {
    category: "Tech",
    slug: "tech",
    lead: {
      title: "Next-Generation Optical Computers Enter Commercial Pilots",
      slug: "optical-computers-commercial-pilots",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80",
      time: "1 hr ago",
    },
    links: [
      { title: "Autonomous cargo vessels complete transatlantic voyage", slug: "autonomous-cargo-vessels", time: "6 hrs ago" },
      { title: "Synthetic biology lab synthesizes resilient crop genes", slug: "synthetic-biology-crop-genes", time: "9 hrs ago" },
    ],
  },
  {
    category: "Culture & Sports",
    slug: "culture",
    lead: {
      title: "Biennale Celebrates Century of Avant-Garde Expression",
      slug: "biennale-celebrates-avant-garde",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80",
      time: "4 hrs ago",
    },
    links: [
      { title: "National tennis academy unveils state-of-the-art facility", slug: "national-tennis-academy", time: "7 hrs ago" },
      { title: "Restored silent cinema masterpiece premieres in Venice", slug: "restored-silent-cinema-venice", time: "10 hrs ago" },
    ],
  },
];

export default function FourColumnGrid() {
  return (
    <section className="py-8 border-b border-[#E2E2E2]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:divide-x lg:divide-[#E2E2E2]">
        {COLUMNS.map((col, idx) => (
          <div key={col.category} className={`${idx !== 0 ? "lg:pl-6" : ""} flex flex-col justify-between`}>
            <div>
              {/* Column Category Title */}
              <div className="border-b-2 border-[#1A1A1A] pb-1.5 mb-3">
                <Link
                  href={`/category/${col.slug}`}
                  className="font-serif font-bold text-sm text-[#1A1A1A] uppercase tracking-wider hover:text-[#B80000] transition-colors"
                >
                  {col.category}
                </Link>
              </div>

              {/* Lead Image & Headline */}
              <article className="group mb-4">
                <Link
                  href={`/article/${col.lead.slug}`}
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-2"
                >
                  <Image
                    src={col.lead.image}
                    alt={col.lead.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <Link href={`/article/${col.lead.slug}`}>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-snug">
                    {col.lead.title}
                  </h4>
                </Link>
                <span className="text-[11px] text-neutral-400 font-medium block mt-1">
                  {col.lead.time}
                </span>
              </article>

              {/* Sub-links */}
              <div className="divide-y divide-neutral-200 border-t border-neutral-200">
                {col.links.map((link) => (
                  <article key={link.slug} className="py-2.5 group">
                    <Link href={`/article/${link.slug}`}>
                      <h5 className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] group-hover:text-[#B80000] transition-colors leading-snug">
                        {link.title}
                      </h5>
                    </Link>
                    <span className="text-[10px] text-neutral-400 font-medium block mt-1">
                      {link.time}
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
