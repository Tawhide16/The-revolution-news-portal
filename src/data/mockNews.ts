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
    title: "Interim Government unveils comprehensive roadmap for electoral and constitutional reforms in Dhaka",
    slug: "interim-government-comprehensive-roadmap-electoral-constitutional-reforms",
    timeAgo: "8m ago",
    category: "Bangladesh",
  },
  {
    id: "br-2",
    title: "Bangladesh monthly remittance inflows cross $2.4 billion following banking governance reforms",
    slug: "bangladesh-remittance-inflows-surge-banking-stabilisation",
    timeAgo: "22m ago",
    category: "Business",
  },
];

export const HERO_STORIES: {
  lead: MockArticle;
  leftStories: MockArticle[];
  rightStories: MockArticle[];
} = {
  lead: {
    id: "art-bd-1",
    title: "Interim Government Unveils Comprehensive Roadmap for Electoral and Constitutional Reforms",
    slug: "interim-government-comprehensive-roadmap-electoral-constitutional-reforms",
    summary:
      "Chief Adviser Prof. Muhammad Yunus coordinates high-level reform commissions focusing on judicial autonomy, electoral integrity, and civil administration overhaul across Bangladesh.",
    content: "Chief Adviser Prof. Muhammad Yunus outlined a structured roadmap...",
    coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    category: { id: "cat-0", name: "Bangladesh", slug: "bangladesh" },
    author: { name: "Tanvir Ahmed" },
    featured: true,
    breaking: true,
    views: 28400,
    publishedAt: "2026-10-10T08:00:00Z",
    timeAgo: "15 mins ago",
    relatedBullets: [
      "Live updates: Consultations with political factions commence in Dhaka",
      "Judicial & electoral commission reform committees outline 90-day targets",
      "International development partners pledge technical backing for institutional overhaul",
    ],
  },
  leftStories: [
    {
      id: "art-bd-6",
      title: "National Consensus Dialogue: Political Parties Deliberate on Institutional Transition in Dhaka",
      slug: "national-consensus-dialogue-political-parties-deliberate-dhaka",
      summary: "Representatives of major political parties and civic coalitions gather in Dhaka to forge consensus on constitutional safeguards.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a62f?auto=format&fit=crop&w=600&q=80",
      category: { id: "cat-2", name: "Politics", slug: "politics" },
      author: { name: "Tanvir Ahmed" },
      views: 18200,
      publishedAt: "2026-10-10T04:30:00Z",
      timeAgo: "2 hrs ago",
    },
    {
      id: "left-2",
      title: "Clean Fusion Reactor Sustains Net-Energy Plasma for Record 48 Hours",
      slug: "clean-fusion-reactor-sustains-net-energy-plasma",
      summary: "Physicists in Oxford declare a transformative milestone for grid-scale fusion energy.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80",
      category: { id: "cat-4", name: "Tech", slug: "tech" },
      author: { name: "Marcus Chen" },
      views: 11200,
      publishedAt: "2026-10-07T06:45:00Z",
      timeAgo: "3 hrs ago",
    },
  ],
  rightStories: [
    {
      id: "art-bd-9",
      title: "Padma Bridge Rail Corridor Accelerates Southwest Freight Logistics and Regional Trade",
      slug: "padma-bridge-rail-corridor-freight-logistics-regional-trade",
      summary: "Direct freight train routes connecting Dhaka with Mongla Port and Benapole Land Port reduce overland logistics transit times by over twelve hours.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
      category: { id: "cat-0", name: "Bangladesh", slug: "bangladesh" },
      author: { name: "Tanvir Ahmed" },
      views: 17800,
      publishedAt: "2026-10-09T12:00:00Z",
      timeAgo: "1 hr ago",
    },
    {
      id: "art-bd-10",
      title: "Bangladesh Women's Cricket Team Dominates Regional Series with Record Bowling Spell",
      slug: "bangladesh-womens-cricket-team-dominates-regional-series",
      summary: "A disciplined spin attack and clinical run-chase in Mirpur seals a dominant series victory, drawing enthusiastic praise across international cricket media.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?auto=format&fit=crop&w=600&q=80",
      category: { id: "cat-6", name: "Sports", slug: "sports" },
      author: { name: "Tanvir Ahmed" },
      views: 14200,
      publishedAt: "2026-10-09T10:00:00Z",
      timeAgo: "3 hrs ago",
    },
    {
      id: "art-bd-11",
      title: "Agricultural Researchers in Gazipur Develop High-Yield Salt-Tolerant Rice Strains",
      slug: "agricultural-researchers-gazipur-salt-tolerant-rice-strains",
      summary: "Breakthrough crop varieties permit farmers in cyclone-prone southern delta districts to double winter harvest yields despite high soil salinity.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80",
      category: { id: "cat-5", name: "Science", slug: "science" },
      author: { name: "Nusrat Jahan" },
      views: 11800,
      publishedAt: "2026-10-09T08:30:00Z",
      timeAgo: "5 hrs ago",
    },
  ],
};

export const SECONDARY_FEATURE_CARDS: MockArticle[] = [
  {
    id: "art-bd-2",
    title: "Bangladesh Remittance Inflows Surge to Record $2.4 Billion Monthly Amid Banking Sector Stability",
    slug: "bangladesh-remittance-inflows-surge-banking-stabilisation",
    summary:
      "Expatriate earnings hit milestone highs following transparent market-based exchange rate mechanisms and governance reforms spearheaded by Bangladesh Bank.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-3", name: "Business", slug: "business" },
    author: { name: "Nusrat Jahan" },
    views: 21300,
    publishedAt: "2026-10-10T07:30:00Z",
    timeAgo: "1 hr ago",
  },
  {
    id: "art-bd-3",
    title: "Readymade Garment Industry Expands Green Manufacturing with Over 250 LEED-Certified Eco-Factories",
    slug: "rmg-industry-green-manufacturing-leed-certified-factories",
    summary:
      "Bangladeshi apparel exporters cement global supremacy in sustainable textile production, securing major long-term export orders from European and North American retail giants.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-3", name: "Business & Economy", slug: "business" },
    author: { name: "Tanvir Ahmed" },
    views: 16500,
    publishedAt: "2026-10-10T06:45:00Z",
    timeAgo: "2 hrs ago",
  },
];

export const HORIZONTAL_CARD_ROW: MockArticle[] = [
  {
    id: "art-bd-5",
    title: "Dhaka Metro Rail MRT Line-6 Adds Night Services to Meet High Commuter Volumes",
    slug: "dhaka-metro-rail-mrt-6-extends-evening-services",
    summary: "Mass Rapid Transit Authority expands operating hours between Motijheel and Uttara North, reducing rush-hour gridlock.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=500&q=80",
    category: { id: "cat-0", name: "Bangladesh", slug: "bangladesh" },
    author: { name: "Nusrat Jahan" },
    views: 19100,
    publishedAt: "2026-10-10T05:15:00Z",
    timeAgo: "3 hrs ago",
  },
  {
    id: "art-bd-4",
    title: "BCB Announces Overhauled Domestic Structure as National Cricket Team Gears Up for Test Series",
    slug: "bcb-appoints-new-coaching-panel-test-championship",
    summary: "The Bangladesh Cricket Board introduces performance-linked contracts and sporting wickets for the National Cricket League.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=500&q=80",
    category: { id: "cat-6", name: "Sports", slug: "sports" },
    author: { name: "Tanvir Ahmed" },
    views: 24700,
    publishedAt: "2026-10-10T06:00:00Z",
    timeAgo: "4 hrs ago",
  },
  {
    id: "art-bd-7",
    title: "Dhaka Tech Hubs Surge as Freelance and Software Export Revenues Target $5 Billion Milestone",
    slug: "dhaka-tech-hubs-bangladesh-it-freelance-software-export",
    summary: "Young software engineers and tech entrepreneurs drive rapid expansion in cloud infrastructure, AI applications, and foreign remittances.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80",
    category: { id: "cat-4", name: "Tech", slug: "tech" },
    author: { name: "Marcus Chen" },
    views: 15800,
    publishedAt: "2026-10-09T18:00:00Z",
    timeAgo: "6 hrs ago",
  },
  {
    id: "art-bd-8",
    title: "Delta Plan 2100: Coastal Embankments Fortify Sundarbans Belt Against Tidal Surges",
    slug: "delta-plan-2100-coastal-embankment-sundarbans-tidal-surges",
    summary: "Engineers deploy nature-based mangrove fortifications and geotextile dykes to protect vulnerable communities in Khulna.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=500&q=80",
    category: { id: "cat-5", name: "Science", slug: "science" },
    author: { name: "Nusrat Jahan" },
    views: 12900,
    publishedAt: "2026-10-09T16:20:00Z",
    timeAgo: "7 hrs ago",
  },
  {
    id: "art-1",
    title: "Historic Peace Treaty Signed as Border Talks Conclude After Decades of Conflict",
    slug: "historic-peace-treaty-signed-border-talks-conclude",
    summary: "Delegates from both nations signed the comprehensive diplomatic framework this morning, unlocking trade corridors.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=500&q=80",
    category: { id: "cat-1", name: "World", slug: "world" },
    author: { name: "Admin Chief" },
    views: 14250,
    publishedAt: "2026-10-07T08:15:00Z",
    timeAgo: "8 hrs ago",
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
    category: "Bangladesh",
    slug: "bangladesh",
    lead: {
      id: "art-bd-1",
      title: "Interim Government Unveils Comprehensive Roadmap for Electoral Reforms",
      slug: "interim-government-comprehensive-roadmap-electoral-constitutional-reforms",
      summary: "Chief Adviser Prof. Muhammad Yunus coordinates high-level reform commissions focusing on judicial autonomy and electoral integrity.",
      coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
      timeAgo: "1 hr ago",
    },
    items: [
      {
        id: "art-bd-5",
        title: "Dhaka Metro Rail Line-6 adds night services to meet commuter volumes",
        slug: "dhaka-metro-rail-mrt-6-extends-evening-services",
        timeAgo: "2 hrs ago",
      },
      {
        id: "art-bd-9",
        title: "Padma Bridge rail corridor accelerates freight logistics and regional trade",
        slug: "padma-bridge-rail-corridor-freight-logistics-regional-trade",
        timeAgo: "4 hrs ago",
      },
      {
        id: "art-bd-6",
        title: "National consensus dialogue: Political factions deliberate transition in Dhaka",
        slug: "national-consensus-dialogue-political-parties-deliberate-dhaka",
        timeAgo: "6 hrs ago",
      },
    ],
  },
  {
    category: "Business",
    slug: "business",
    lead: {
      id: "art-bd-2",
      title: "Bangladesh Remittance Inflows Surge to Record $2.4 Billion Monthly",
      slug: "bangladesh-remittance-inflows-surge-banking-stabilisation",
      summary: "Transparent market-based exchange rates and banking governance drive remarkable surge in foreign earnings.",
      coverImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
      timeAgo: "2 hrs ago",
    },
    items: [
      {
        id: "art-bd-3",
        title: "RMG sector expands green manufacturing with 250+ eco-factories",
        slug: "rmg-industry-green-manufacturing-leed-certified-factories",
        timeAgo: "3 hrs ago",
      },
      {
        id: "cat-b-2",
        title: "European energy markets stabilize as natural gas reserves top 95%",
        slug: "central-banks-signal-coordinated-interest-rate-reductions",
        timeAgo: "5 hrs ago",
      },
      {
        id: "cat-b-3",
        title: "Central banks signal coordinated shift toward interest rate reductions",
        slug: "central-banks-signal-coordinated-interest-rate-reductions",
        timeAgo: "8 hrs ago",
      },
    ],
  },
  {
    category: "Sports & Science",
    slug: "sports",
    lead: {
      id: "art-bd-4",
      title: "BCB Announces Overhauled Domestic Structure as Tigers Prep for Tests",
      slug: "bcb-appoints-new-coaching-panel-test-championship",
      summary: "Performance-linked contracts and sporting pitches introduced for long-term red-ball excellence.",
      coverImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80",
      timeAgo: "3 hrs ago",
    },
    items: [
      {
        id: "art-bd-10",
        title: "Bangladesh Women's cricket team seals regional series victory in Mirpur",
        slug: "bangladesh-womens-cricket-team-dominates-regional-series",
        timeAgo: "4 hrs ago",
      },
      {
        id: "art-bd-8",
        title: "Delta Plan 2100: Coastal embankments fortify Sundarbans belt against surges",
        slug: "delta-plan-2100-coastal-embankment-sundarbans-tidal-surges",
        timeAgo: "6 hrs ago",
      },
      {
        id: "art-bd-11",
        title: "Agricultural scientists in Gazipur develop salt-tolerant rice strains",
        slug: "agricultural-researchers-gazipur-salt-tolerant-rice-strains",
        timeAgo: "8 hrs ago",
      },
    ],
  },
];

export const MOST_READ_ARTICLES = [
  {
    rank: 1,
    title: "Interim Government Unveils Comprehensive Roadmap for Electoral and Constitutional Reforms",
    slug: "interim-government-comprehensive-roadmap-electoral-constitutional-reforms",
    category: "Bangladesh",
    views: 28400,
  },
  {
    rank: 2,
    title: "BCB Announces Overhauled Domestic Structure as National Cricket Team Gears Up for Tests",
    slug: "bcb-appoints-new-coaching-panel-test-championship",
    category: "Sports",
    views: 24700,
  },
  {
    rank: 3,
    title: "Bangladesh Remittance Inflows Surge to Record $2.4 Billion Monthly",
    slug: "bangladesh-remittance-inflows-surge-banking-stabilisation",
    category: "Business",
    views: 21300,
  },
  {
    rank: 4,
    title: "Dhaka Metro Rail MRT Line-6 Adds Night Services to Meet High Commuter Volumes",
    slug: "dhaka-metro-rail-mrt-6-extends-evening-services",
    category: "Bangladesh",
    views: 19100,
  },
  {
    rank: 5,
    title: "National Consensus Dialogue: Political Parties Deliberate on Institutional Transition in Dhaka",
    slug: "national-consensus-dialogue-political-parties-deliberate-dhaka",
    category: "Politics",
    views: 18200,
  },
];
