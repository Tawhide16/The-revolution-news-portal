import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    category: "Bangladesh",
    slug: "bangladesh",
    lead: {
      title: "Interim Government Unveils Roadmap for Electoral Reforms",
      slug: "interim-government-comprehensive-roadmap-electoral-constitutional-reforms",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=500&q=80",
      time: "2 hrs ago",
    },
    links: [
      { title: "Dhaka Metro Rail Line-6 expands evening services", slug: "dhaka-metro-rail-mrt-6-extends-evening-services", time: "3 hrs ago" },
      { title: "Padma Bridge rail corridor accelerates freight trade", slug: "padma-bridge-rail-corridor-freight-logistics-regional-trade", time: "5 hrs ago" },
    ],
  },
  {
    category: "Politics",
    slug: "politics",
    lead: {
      title: "National Consensus Dialogue: Political Factions Deliberate in Dhaka",
      slug: "national-consensus-dialogue-political-parties-deliberate-dhaka",
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a62f?auto=format&fit=crop&w=500&q=80",
      time: "4 hrs ago",
    },
    links: [
      { title: "Judicial overhaul: High Court reconstitutes public interest benches", slug: "interim-government-comprehensive-roadmap-electoral-constitutional-reforms", time: "6 hrs ago" },
      { title: "Supreme Court delivers landmark ruling on algorithmic privacy", slug: "supreme-court-landmark-ruling-algorithmic-privacy", time: "8 hrs ago" },
    ],
  },
  {
    category: "Business",
    slug: "business",
    lead: {
      title: "Remittance Inflows Surge to $2.4B Amid Banking Stabilisation",
      slug: "bangladesh-remittance-inflows-surge-banking-stabilisation",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=500&q=80",
      time: "1 hr ago",
    },
    links: [
      { title: "RMG sector expands green manufacturing with 250+ eco-factories", slug: "rmg-industry-green-manufacturing-leed-certified-factories", time: "3 hrs ago" },
      { title: "Central banks signal coordinated shift toward interest rate reductions", slug: "central-banks-signal-coordinated-interest-rate-reductions", time: "7 hrs ago" },
    ],
  },
  {
    category: "Sports & Tech",
    slug: "sports",
    lead: {
      title: "BCB Announces Overhauled Domestic Structure for Tigers",
      slug: "bcb-appoints-new-coaching-panel-test-championship",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=500&q=80",
      time: "2 hrs ago",
    },
    links: [
      { title: "Bangladesh Women's cricket team seals regional series victory", slug: "bangladesh-womens-cricket-team-dominates-regional-series", time: "4 hrs ago" },
      { title: "Dhaka tech hubs surge as software export revenues target $5B", slug: "dhaka-tech-hubs-bangladesh-it-freelance-software-export", time: "6 hrs ago" },
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
