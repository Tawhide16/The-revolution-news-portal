import fs from "fs";
import path from "path";

export interface StoredArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  layout?: "standard" | "hero" | "two-column" | "minimal";
  targetDevice?: "both" | "desktop" | "mobile";
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  authorId: string;
  authorName: string;
  status: "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  breaking: boolean;
  views: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface StoredCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

export interface StoredTag {
  id: string;
  name: string;
  slug: string;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "AUTHOR" | "WRITER";
  active: boolean;
  password?: string;
  createdAt: string;
}

export interface StoredMedia {
  id: string;
  url: string;
  name: string;
  alt: string;
  sizeBytes: number;
  createdAt: string;
  uploadedBy: string;
}

export interface StoredSettings {
  siteName: string;
  tagline: string;
  breakingEnabled: boolean;
  breakingCustomText: string;
  breakingUrl: string;
  contactEmail: string;
  twitterUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  newsletterHeadline: string;
  newsletterDescription: string;
}

export interface StoredAuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  userId: string;
  userName: string;
  createdAt: string;
  details?: string;
}

export interface DatabaseState {
  articles: StoredArticle[];
  categories: StoredCategory[];
  tags: StoredTag[];
  users: StoredUser[];
  media: StoredMedia[];
  settings: StoredSettings;
  auditLogs: StoredAuditLog[];
}

const DATA_FILE = path.join(process.cwd(), "data", "store.json");

function getDefaultState(): DatabaseState {
  return {
    settings: {
      siteName: "The Revolution",
      tagline: "Fearless, independent public-interest journalism",
      breakingEnabled: true,
      breakingCustomText: "Global leaders reach emergency climate accord after marathon negotiations in Geneva",
      breakingUrl: "/article/historic-peace-treaty-signed-border-talks-conclude",
      contactEmail: "editor@revolution.news",
      twitterUrl: "https://twitter.com/revolution_news",
      facebookUrl: "https://facebook.com/revolution_news",
      youtubeUrl: "https://youtube.com/revolution_news",
      newsletterHeadline: "The Morning Briefing",
      newsletterDescription: "Get essential global analysis delivered to your inbox every dawn.",
    },
    categories: [
      { id: "cat-1", name: "World", slug: "world", description: "Global geopolitical affairs, diplomacy, and international reporting", order: 1 },
      { id: "cat-2", name: "Politics", slug: "politics", description: "Government, elections, legislation, and civil rights", order: 2 },
      { id: "cat-3", name: "Business", slug: "business", description: "Global markets, finance, trade, and economic developments", order: 3 },
      { id: "cat-4", name: "Tech", slug: "tech", description: "Emerging computing, AI, cybersecurity, and hardware", order: 4 },
      { id: "cat-5", name: "Science", slug: "science", description: "Space exploration, climate research, and bioengineering", order: 5 },
      { id: "cat-6", name: "Sports", slug: "sports", description: "Championship tournaments, athletics, and international leagues", order: 6 },
      { id: "cat-7", name: "Entertainment", slug: "entertainment", description: "Arts, cinema, literature, and contemporary culture", order: 7 },
      { id: "cat-8", name: "Opinion", slug: "opinion", description: "Editorial commentary, columns, and critical perspectives", order: 8 },
    ],
    tags: [
      { id: "tag-1", name: "Breaking News", slug: "breaking-news" },
      { id: "tag-2", name: "Investigation", slug: "investigation" },
      { id: "tag-3", name: "Climate Summit", slug: "climate-summit" },
      { id: "tag-4", name: "Artificial Intelligence", slug: "artificial-intelligence" },
      { id: "tag-5", name: "Economy", slug: "economy" },
      { id: "tag-6", name: "Human Rights", slug: "human-rights" },
    ],
    users: [
      { id: "u-1", name: "Admin Chief", email: "admin@example.com", role: "ADMIN", active: true, createdAt: new Date().toISOString() },
      { id: "u-2", name: "Elena Rostova", email: "editor@example.com", role: "EDITOR", active: true, createdAt: new Date().toISOString() },
      { id: "u-3", name: "Marcus Chen", email: "author@example.com", role: "AUTHOR", active: true, createdAt: new Date().toISOString() },
      { id: "u-4", name: "Sarah Writer", email: "writer@example.com", role: "WRITER", active: true, createdAt: new Date().toISOString() },
    ],
    media: [
      {
        id: "m-1",
        url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
        name: "diplomatic_summit_peace.jpg",
        alt: "Diplomatic peace delegation signing ceremony",
        sizeBytes: 420000,
        createdAt: new Date().toISOString(),
        uploadedBy: "Admin Chief",
      },
      {
        id: "m-2",
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
        name: "court_justice.jpg",
        alt: "Supreme Court pillars and scales of justice",
        sizeBytes: 310000,
        createdAt: new Date().toISOString(),
        uploadedBy: "Admin Chief",
      },
      {
        id: "m-3",
        url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80",
        name: "fusion_reactor.jpg",
        alt: "Magnetic confinement fusion vacuum chamber",
        sizeBytes: 520000,
        createdAt: new Date().toISOString(),
        uploadedBy: "Admin Chief",
      },
      {
        id: "m-4",
        url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
        name: "financial_markets.jpg",
        alt: "Financial trading terminal monitors",
        sizeBytes: 380000,
        createdAt: new Date().toISOString(),
        uploadedBy: "Admin Chief",
      },
    ],
    articles: [
      {
        id: "art-1",
        title: "Historic Peace Treaty Signed as Border Talks Conclude After Decades of Conflict",
        slug: "historic-peace-treaty-signed-border-talks-conclude",
        summary: "Delegates from both nations signed the comprehensive diplomatic framework this morning, unlocking trade corridors and establishing immediate ceasefires along disputed frontiers.",
        content: "<p>Delegates from both nations signed the comprehensive diplomatic framework this morning in Geneva, unlocking strategic trade corridors and establishing immediate ceasefires along disputed frontiers.</p><p>International observers praised the agreement as a defining victory for long-term multilateral diplomacy after months of tense, round-the-clock negotiations.</p><blockquote>&ldquo;This accord proves that even the most deeply entrenched divisions can yield when nations commit to dialogue and shared prosperity,&rdquo; remarked the chief mediator.</blockquote><p>Trade borders are scheduled to reopen within seventy-two hours, with joint peacekeeping patrols monitoring key transport arteries.</p>",
        coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
        categoryId: "cat-1",
        categoryName: "World",
        categorySlug: "world",
        authorId: "u-1",
        authorName: "Admin Chief",
        status: "PUBLISHED",
        featured: true,
        breaking: false,
        views: 14250,
        publishedAt: "2026-10-07T08:15:00.000Z",
        createdAt: "2026-10-07T07:00:00.000Z",
        updatedAt: "2026-10-07T08:15:00.000Z",
        tags: ["Breaking News", "Diplomacy", "Climate Summit"],
      },
      {
        id: "art-2",
        title: "Supreme Court Delivers Landmark Ruling on Algorithmic Privacy Rights",
        slug: "supreme-court-landmark-ruling-algorithmic-privacy",
        summary: "Justices unanimously ruled that automated profiling requires explicit user consent, establishing unprecedented safeguards for digital citizens.",
        content: "<p>The Supreme Court ruled unanimously today that tech corporations cannot subject citizens to biometric or behavioral profiling without explicit, affirmative consent.</p><p>Civil liberties advocates hailed the judgment as the most consequential privacy victory in a generation.</p>",
        coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
        categoryId: "cat-2",
        categoryName: "Politics",
        categorySlug: "politics",
        authorId: "u-2",
        authorName: "Elena Rostova",
        status: "PUBLISHED",
        featured: false,
        breaking: false,
        views: 8900,
        publishedAt: "2026-10-07T07:30:00.000Z",
        createdAt: "2026-10-07T06:00:00.000Z",
        updatedAt: "2026-10-07T07:30:00.000Z",
        tags: ["Human Rights", "Artificial Intelligence"],
      },
      {
        id: "art-3",
        title: "Clean Fusion Reactor Sustains Net-Energy Plasma for Record 48 Hours",
        slug: "clean-fusion-reactor-sustains-net-energy-plasma",
        summary: "Physicists in Oxford declare a transformative milestone for grid-scale fusion energy, producing three times the ignition energy input.",
        content: "<p>A consortium of nuclear physicists has announced a sustained net-energy fusion reaction lasting forty-eight consecutive hours, generating continuous thermal output without plasma disruption.</p><p>Commercial pilot plants are now slated to break ground ahead of schedule.</p>",
        coverImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80",
        categoryId: "cat-4",
        categoryName: "Tech",
        categorySlug: "tech",
        authorId: "u-3",
        authorName: "Marcus Chen",
        status: "PUBLISHED",
        featured: false,
        breaking: false,
        views: 11200,
        publishedAt: "2026-10-07T06:45:00.000Z",
        createdAt: "2026-10-07T05:00:00.000Z",
        updatedAt: "2026-10-07T06:45:00.000Z",
        tags: ["Artificial Intelligence", "Climate Summit"],
      },
      {
        id: "art-4",
        title: "Central Banks Signal Coordinated Shift Toward Interest Rate Reductions",
        slug: "central-banks-signal-coordinated-interest-rate-reductions",
        summary: "Cooling inflation metrics across Europe and Asia prompt monetary easing discussions as manufacturing output rebounds.",
        content: "<p>Leading central bank governors confirmed this afternoon that benchmark interest rates are positioned for synchronised reductions following three quarters of declining headline inflation.</p>",
        coverImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
        categoryId: "cat-3",
        categoryName: "Business",
        categorySlug: "business",
        authorId: "u-2",
        authorName: "Elena Rostova",
        status: "PUBLISHED",
        featured: false,
        breaking: false,
        views: 7450,
        publishedAt: "2026-10-07T08:00:00.000Z",
        createdAt: "2026-10-07T06:30:00.000Z",
        updatedAt: "2026-10-07T08:00:00.000Z",
        tags: ["Economy"],
      },
      {
        id: "art-5",
        title: "Inside the High-Altitude Seed Vault Guarding the Planet's Biodiversity",
        slug: "inside-high-altitude-seed-vault-biodiversity",
        summary: "Deep inside Arctic permafrost, botanists are stockpiling millions of crop varieties against impending ecological upheavals.",
        content: "<p>Buried hundreds of feet beneath Arctic permafrost, scientists have catalogued an additional half-million seed samples to protect humanity's agricultural resilience.</p>",
        coverImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
        categoryId: "cat-5",
        categoryName: "Science",
        categorySlug: "science",
        authorId: "u-1",
        authorName: "Admin Chief",
        status: "PUBLISHED",
        featured: true,
        breaking: false,
        views: 12400,
        publishedAt: "2026-10-07T03:00:00.000Z",
        createdAt: "2026-10-07T02:00:00.000Z",
        updatedAt: "2026-10-07T03:00:00.000Z",
        tags: ["Climate Summit"],
      },
      {
        id: "art-6",
        title: "Championship Underdogs Pull Off Stunner in Final Minutes of Extra Time",
        slug: "championship-underdogs-pull-off-stunner",
        summary: "A 94th-minute volley secures improbable qualification in European competition, sparking jubilant scenes.",
        content: "<p>In an unforgettable upset that defied all analytical predictions, the unseeded challengers clinched a last-gasp winner in the dying moments of stoppage time.</p>",
        coverImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
        categoryId: "cat-6",
        categoryName: "Sports",
        categorySlug: "sports",
        authorId: "u-3",
        authorName: "Marcus Chen",
        status: "PUBLISHED",
        featured: false,
        breaking: false,
        views: 6300,
        publishedAt: "2026-10-07T04:10:00.000Z",
        createdAt: "2026-10-07T03:00:00.000Z",
        updatedAt: "2026-10-07T04:10:00.000Z",
        tags: [],
      },
      {
        id: "art-7",
        title: "Draft Proposal: Next-Gen Autonomous Transport Regulations",
        slug: "draft-proposal-autonomous-transport-regulations",
        summary: "Working internal review draft on safety certification standards for municipal autonomous transit systems.",
        content: "<p>This working paper outlines recommended certification requirements for Level 4 automated transit networks across urban metropolitan zones.</p>",
        coverImage: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=80",
        categoryId: "cat-4",
        categoryName: "Tech",
        categorySlug: "tech",
        authorId: "u-3",
        authorName: "Marcus Chen",
        status: "DRAFT",
        featured: false,
        breaking: false,
        views: 120,
        publishedAt: "",
        createdAt: "2026-10-07T09:00:00.000Z",
        updatedAt: "2026-10-07T09:00:00.000Z",
        tags: ["Investigation"],
      },
      {
        id: "art-8",
        title: "Investigation: Offshore Financial Flows In High-Value Real Estate",
        slug: "investigation-offshore-financial-flows-real-estate",
        summary: "Special editorial report submitted for senior editorial review regarding non-transparent shell companies.",
        content: "<p>Cross-border financial forensics reveal the intricate maze of shell entities utilised to acquire prime urban properties while masking ultimate beneficial ownership.</p>",
        coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
        categoryId: "cat-3",
        categoryName: "Business",
        categorySlug: "business",
        authorId: "u-2",
        authorName: "Elena Rostova",
        status: "REVIEW",
        featured: false,
        breaking: false,
        views: 45,
        publishedAt: "",
        createdAt: "2026-10-07T08:30:00.000Z",
        updatedAt: "2026-10-07T08:30:00.000Z",
        tags: ["Investigation", "Economy"],
      },
    ],
    auditLogs: [
      {
        id: "log-1",
        action: "PUBLISH",
        entity: "Article",
        entityId: "art-1",
        userId: "u-1",
        userName: "Admin Chief",
        createdAt: "2026-10-07T08:15:00.000Z",
        details: "Published lead article 'Historic Peace Treaty Signed'",
      },
      {
        id: "log-2",
        action: "CREATE",
        entity: "Article",
        entityId: "art-8",
        userId: "u-2",
        userName: "Elena Rostova",
        createdAt: "2026-10-07T08:30:00.000Z",
        details: "Submitted article 'Offshore Financial Flows' for REVIEW",
      },
    ],
  };
}

export function getDb(): DatabaseState {
  try {
    const defaults = getDefaultState();
    if (!fs.existsSync(DATA_FILE)) {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaults, null, 2), "utf8");
      return defaults;
    }
    const data = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(data);
    return {
      settings: parsed.settings || defaults.settings,
      categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : defaults.categories,
      tags: parsed.tags && parsed.tags.length > 0 ? parsed.tags : defaults.tags,
      users: parsed.users && parsed.users.length > 0 ? parsed.users : defaults.users,
      media: parsed.media && parsed.media.length > 0 ? parsed.media : defaults.media,
      articles: parsed.articles || defaults.articles,
      auditLogs: parsed.auditLogs || defaults.auditLogs,
    };
  } catch (err) {
    console.error("Error reading database file, returning default state:", err);
    return getDefaultState();
  }
}

export function saveDb(state: DatabaseState): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to database file:", err);
  }
}

export function logAudit(
  action: string,
  entity: string,
  entityId: string | undefined,
  userId: string,
  userName: string,
  details?: string
): void {
  const db = getDb();
  const log: StoredAuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    action,
    entity,
    entityId,
    userId,
    userName,
    createdAt: new Date().toISOString(),
    details,
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 200) {
    db.auditLogs = db.auditLogs.slice(0, 200);
  }
  saveDb(db);
}
