export interface MockArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    name: string;
  };
  featured?: boolean;
  breaking?: boolean;
  views: number;
  publishedAt: string;
  timeAgo: string;
  tag?: string;
  videoDuration?: string;
  relatedBullets?: string[];
}

export const BREAKING_NEWS = [
  {
    id: "br-1",
    title: "Global leaders reach emergency climate accord after marathon negotiations in Geneva",
    slug: "global-leaders-emergency-climate-accord-geneva",
    timeAgo: "12m ago",
    category: "World",
  },
  {
    id: "br-2",
    title: "Major tech coalition unveils universal safety framework for sovereign AI systems",
    slug: "tech-coalition-universal-safety-framework-sovereign-ai",
    timeAgo: "28m ago",
    category: "Tech",
  },
];

export const HERO_STORIES: {
  lead: MockArticle;
  leftStories: MockArticle[];
  rightStories: MockArticle[];
} = {
  lead: {
    id: "lead-1",
    title: "Historic Peace Treaty Signed as Border Talks Conclude After Decades of Conflict",
    slug: "historic-peace-treaty-signed-border-talks-conclude",
    summary:
      "Delegates from both nations signed the comprehensive diplomatic framework this morning, unlocking trade corridors and establishing immediate ceasefires along disputed frontiers.",
    content: "Full diplomatic accords were initialed under international mediation...",
    coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    category: { id: "c-world", name: "World", slug: "world" },
    author: { name: "Alastair Vance" },
    featured: true,
    breaking: false,
    views: 14250,
    publishedAt: "2026-10-07T08:15:00Z",
    timeAgo: "45 mins ago",
    relatedBullets: [
      "Live updates: Reactions from world capitals and UN council",
      "Analysis: How economic leverage finally forced a diplomatic breakthrough",
      "Timeline: Thirty years of tensions leading to today's accord",
    ],
  },
  leftStories: [
    {
      id: "left-1",
      title: "Supreme Court Delivers Landmark Ruling on Algorithmic Privacy Rights",
      slug: "supreme-court-landmark-ruling-algorithmic-privacy",
      summary: "Justices unanimously ruled that automated profiling requires explicit user consent.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
      category: { id: "c-politics", name: "Politics", slug: "politics" },
      author: { name: "Helena Moreau" },
      views: 8900,
      publishedAt: "2026-10-07T07:30:00Z",
      timeAgo: "2 hrs ago",
    },
    {
      id: "left-2",
      title: "Clean Fusion Reactor Sustains Net-Energy Plasma for Record 48 Hours",
      slug: "clean-fusion-reactor-sustains-net-energy-plasma",
      summary: "Physicists in Oxford declare a transformative milestone for grid-scale fusion energy.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80",
      category: { id: "c-tech", name: "Tech", slug: "tech" },
      author: { name: "Dr. Marcus Wei" },
      views: 11200,
      publishedAt: "2026-10-07T06:45:00Z",
      timeAgo: "3 hrs ago",
    },
  ],
  rightStories: [
    {
      id: "right-1",
      title: "Central Banks Signal Coordinated Shift Toward Interest Rate Reductions",
      slug: "central-banks-signal-coordinated-interest-rate-reductions",
      summary: "Cooling inflation metrics across Europe and Asia prompt monetary easing discussions.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
      category: { id: "c-business", name: "Business", slug: "business" },
      author: { name: "Sophie Sterling" },
      views: 7450,
      publishedAt: "2026-10-07T08:00:00Z",
      timeAgo: "1 hr ago",
    },
    {
      id: "right-2",
      title: "Global Supply Chains Pivot to High-Speed Autonomous Freight Corridors",
      slug: "global-supply-chains-pivot-autonomous-freight-corridors",
      summary: "Major shipping hubs integrate electric rail arteries to bypass choke points.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=600&q=80",
      category: { id: "c-business", name: "Business", slug: "business" },
      author: { name: "Julian Thorne" },
      views: 5210,
      publishedAt: "2026-10-07T05:20:00Z",
      timeAgo: "4 hrs ago",
    },
    {
      id: "right-3",
      title: "Championship Underdogs Pull Off Stunner in Final Minutes of Extra Time",
      slug: "championship-underdogs-pull-off-stunner",
      summary: "A 94th-minute volley secures improbable qualification in European competition.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
      category: { id: "c-sports", name: "Sports", slug: "sports" },
      author: { name: "David Cross" },
      views: 6300,
      publishedAt: "2026-10-07T04:10:00Z",
      timeAgo: "5 hrs ago",
    },
  ],
};

export const SECONDARY_FEATURE_CARDS: MockArticle[] = [
  {
    id: "feat-1",
    title: "Inside the High-Altitude Seed Vault Guarding the Planet's Biodiversity",
    slug: "inside-high-altitude-seed-vault-biodiversity",
    summary:
      "Deep inside Arctic permafrost, botanists are stockpiling millions of crop varieties against impending ecological upheavals.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    category: { id: "c-world", name: "Science & Environment", slug: "world" },
    author: { name: "Evelyn Reed" },
    views: 12400,
    publishedAt: "2026-10-07T03:00:00Z",
    timeAgo: "5 hrs ago",
  },
  {
    id: "feat-2",
    title: "The Renaissance of Brutalist Architecture in Contemporary Metropolis Design",
    slug: "renaissance-brutalist-architecture-contemporary-design",
    summary:
      "Modern architects are revisiting raw concrete aesthetics to forge sustainable, ultra-durable civic spaces.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    category: { id: "c-ent", name: "Culture & Design", slug: "entertainment" },
    author: { name: "Julian Thorne" },
    views: 9800,
    publishedAt: "2026-10-07T02:15:00Z",
    timeAgo: "6 hrs ago",
  },
];

export const HORIZONTAL_CARD_ROW: MockArticle[] = [
  {
    id: "row-1",
    title: "Next-Gen Quantum Chips Outperform Supercomputers by Factor of Ten Thousand",
    slug: "next-gen-quantum-chips-outperform-supercomputers",
    summary: "Silicon quantum dots achieve error-corrected stability at ambient lab temperatures.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=500&q=80",
    category: { id: "c-tech", name: "Tech", slug: "tech" },
    author: { name: "Maya Lin" },
    views: 8200,
    publishedAt: "2026-10-07T01:30:00Z",
    timeAgo: "6 hrs ago",
  },
  {
    id: "row-2",
    title: "Voters Demand Fiscal Overhaul as Coalition Government Battles Budget Deficit",
    slug: "voters-demand-fiscal-overhaul-coalition-government",
    summary: "Parliamentary debate extends through the night over proposed pension reforms.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a62f?auto=format&fit=crop&w=500&q=80",
    category: { id: "c-politics", name: "Politics", slug: "politics" },
    author: { name: "Alastair Vance" },
    views: 7100,
    publishedAt: "2026-10-07T01:10:00Z",
    timeAgo: "7 hrs ago",
  },
  {
    id: "row-3",
    title: "Electric Aviation Startup Completes First Commercial Inter-City Flight",
    slug: "electric-aviation-startup-first-commercial-flight",
    summary: "Zero-emissions regional aircraft carries 40 passengers between Paris and Geneva.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=500&q=80",
    category: { id: "c-business", name: "Business", slug: "business" },
    author: { name: "Sophie Sterling" },
    views: 6540,
    publishedAt: "2026-10-06T23:50:00Z",
    timeAgo: "8 hrs ago",
  },
  {
    id: "row-4",
    title: "Archaeologists Unearth Preserved Roman Amphitheatre Along Adriatic Coast",
    slug: "archaeologists-unearth-preserved-roman-amphitheatre",
    summary: "Intact mosaics and underground passageways reveal previously unknown imperial hub.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=500&q=80",
    category: { id: "c-ent", name: "Entertainment", slug: "entertainment" },
    author: { name: "Evelyn Reed" },
    views: 9340,
    publishedAt: "2026-10-06T22:40:00Z",
    timeAgo: "9 hrs ago",
  },
  {
    id: "row-5",
    title: "Record Rainfall Breaks Five-Year Drought in Western Agriculture Basins",
    slug: "record-rainfall-breaks-five-year-drought-agriculture",
    summary: "Reservoir levels surge, offering relief to farmers after prolonged heat waves.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1514632595-4944383f2737?auto=format&fit=crop&w=500&q=80",
    category: { id: "c-world", name: "World", slug: "world" },
    author: { name: "Marcus Wei" },
    views: 4890,
    publishedAt: "2026-10-06T21:20:00Z",
    timeAgo: "10 hrs ago",
  },
];

export const VIDEO_STORIES: MockArticle[] = [
  {
    id: "v-1",
    title: "Dispatch: Living on the Frontlines of the Retreating Arctic Glaciers",
    slug: "dispatch-living-on-frontlines-retreating-arctic-glaciers",
    summary: "Our special correspondent joins glaciologists mapping unprecedented ice shelf fractures.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    category: { id: "c-world", name: "Documentary", slug: "world" },
    author: { name: "The Revolution Media" },
    views: 24300,
    publishedAt: "2026-10-07T05:00:00Z",
    timeAgo: "4 hrs ago",
    videoDuration: "14:22",
  },
  {
    id: "v-2",
    title: "Undercover: Inside the Shadow Networks Smuggling Rare Minerals",
    slug: "undercover-inside-shadow-networks-smuggling-rare-minerals",
    summary: "An investigation into illicit supply chains feeding the world's battery factories.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    category: { id: "c-business", name: "Investigation", slug: "business" },
    author: { name: "The Revolution Media" },
    views: 18900,
    publishedAt: "2026-10-06T18:00:00Z",
    timeAgo: "14 hrs ago",
    videoDuration: "08:45",
  },
  {
    id: "v-3",
    title: "How Autonomous Submersibles Are Mapping the Mariana Trench",
    slug: "autonomous-submersibles-mapping-mariana-trench",
    summary: "Deep sea exploratory drones reveal unknown thermal vent ecosystems.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    category: { id: "c-tech", name: "Technology", slug: "tech" },
    author: { name: "The Revolution Media" },
    views: 15600,
    publishedAt: "2026-10-06T14:30:00Z",
    timeAgo: "18 hrs ago",
    videoDuration: "06:12",
  },
  {
    id: "v-4",
    title: "Behind the Scenes with the Orchestra Staging Beethoven in Ruins",
    slug: "behind-the-scenes-orchestra-beethoven-ruins",
    summary: "Musicians gather in ancient marble amphitheatre to perform for peace.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
    category: { id: "c-ent", name: "Arts & Culture", slug: "entertainment" },
    author: { name: "The Revolution Media" },
    views: 11400,
    publishedAt: "2026-10-06T10:00:00Z",
    timeAgo: "1 day ago",
    videoDuration: "11:04",
  },
];

export const CATEGORY_BLOCKS = [
  {
    category: "World",
    slug: "world",
    lead: {
      id: "cat-w-1",
      title: "G20 Summit Adopts Historic Carbon Border Tariff Framework",
      slug: "g20-summit-carbon-border-tariff-framework",
      summary: "Major economies harmonize carbon accounting standards in bid to curb industrial dumping.",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
      timeAgo: "2 hrs ago",
    },
    items: [
      {
        id: "cat-w-2",
        title: "Peacekeeping Forces Expand Humanitarian Buffer Zone",
        slug: "peacekeeping-forces-expand-humanitarian-buffer",
        timeAgo: "4 hrs ago",
      },
      {
        id: "cat-w-3",
        title: "Nordic Nations Sign Mutual Cybersecurity Defense Pact",
        slug: "nordic-nations-sign-cybersecurity-defense-pact",
        timeAgo: "7 hrs ago",
      },
      {
        id: "cat-w-4",
        title: "Pacific Island Nations Demand Binding Maritime Boundaries",
        slug: "pacific-islands-demand-binding-maritime-boundaries",
        timeAgo: "9 hrs ago",
      },
    ],
  },
  {
    category: "Business",
    slug: "business",
    lead: {
      id: "cat-b-1",
      title: "Semiconductor Giant Commits $40B to Domestic Megafab Expansion",
      slug: "semiconductor-giant-commits-40b-megafab-expansion",
      summary: "The multi-year project aims to shore up supply chain autonomy for microprocessors.",
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      timeAgo: "3 hrs ago",
    },
    items: [
      {
        id: "cat-b-2",
        title: "European Energy Markets Stabilize as Gas Reserves Reach 95%",
        slug: "european-energy-markets-stabilize-gas-reserves",
        timeAgo: "5 hrs ago",
      },
      {
        id: "cat-b-3",
        title: "Tech Giants Face Stricter Scrutiny Over Cloud Vendor Lock-In",
        slug: "tech-giants-scrutiny-cloud-vendor-lockin",
        timeAgo: "8 hrs ago",
      },
      {
        id: "cat-b-4",
        title: "Automaker Slashes Electric Vehicle Prices to Meet Quotas",
        slug: "automaker-slashes-electric-vehicle-prices",
        timeAgo: "11 hrs ago",
      },
    ],
  },
  {
    category: "Tech & Science",
    slug: "tech",
    lead: {
      id: "cat-t-1",
      title: "Neural Interface Startup Receives Fast-Track Human Trial Approval",
      slug: "neural-interface-receives-fast-track-human-trial",
      summary: "Clinical tests aim to restore motor function for patients with spinal cord injuries.",
      coverImage: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80",
      timeAgo: "1 hr ago",
    },
    items: [
      {
        id: "cat-t-2",
        title: "Breakthrough in Solid-State Battery Cathode Chemistry",
        slug: "breakthrough-solid-state-battery-chemistry",
        timeAgo: "3 hrs ago",
      },
      {
        id: "cat-t-3",
        title: "Space Telescope Detects Atmospheric Water Vapor on Super-Earth",
        slug: "space-telescope-detects-water-vapor-super-earth",
        timeAgo: "6 hrs ago",
      },
      {
        id: "cat-t-4",
        title: "Open Source AI Weights Exceed Proprietary Benchmarks",
        slug: "open-source-ai-weights-exceed-proprietary-benchmarks",
        timeAgo: "10 hrs ago",
      },
    ],
  },
];

export const MOST_READ_ARTICLES = [
  {
    rank: 1,
    title: "Historic Peace Treaty Signed as Border Talks Conclude After Decades of Conflict",
    slug: "historic-peace-treaty-signed-border-talks-conclude",
    category: "World",
    views: 14250,
  },
  {
    rank: 2,
    title: "Clean Fusion Reactor Sustains Net-Energy Plasma for Record 48 Hours",
    slug: "clean-fusion-reactor-sustains-net-energy-plasma",
    category: "Tech",
    views: 11200,
  },
  {
    rank: 3,
    title: "Inside the High-Altitude Seed Vault Guarding the Planet's Biodiversity",
    slug: "inside-high-altitude-seed-vault-biodiversity",
    category: "Science",
    views: 10400,
  },
  {
    rank: 4,
    title: "Supreme Court Delivers Landmark Ruling on Algorithmic Privacy Rights",
    slug: "supreme-court-landmark-ruling-algorithmic-privacy",
    category: "Politics",
    views: 8900,
  },
  {
    rank: 5,
    title: "Next-Gen Quantum Chips Outperform Supercomputers by Factor of Ten Thousand",
    slug: "next-gen-quantum-chips-outperform-supercomputers",
    category: "Tech",
    views: 8200,
  },
];
