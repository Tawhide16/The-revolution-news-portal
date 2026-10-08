import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  FileText,
  Clock,
  CheckCircle,
  Eye,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { getDb } from "@/lib/store";
import WriterActivityOverview, { DashboardArticle } from "@/components/admin/WriterActivityOverview";
import DatabaseHealthCard from "@/components/admin/DatabaseHealthCard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role || "ADMIN";
  const isAdmin = userRole === "ADMIN" || userRole === "EDITOR";

  const db = getDb();
  const articles = db.articles;

  const publishedCount = articles.filter((a) => a.status === "PUBLISHED").length;
  const draftCount = articles.filter((a) => a.status === "DRAFT").length;
  const reviewCount = articles.filter((a) => a.status === "REVIEW").length;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

  // Review & Draft articles for newsroom overview
  const reviewArticles: DashboardArticle[] = articles
    .filter((a) => a.status === "REVIEW")
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      categoryName: a.categoryName,
      authorName: a.authorName,
      status: a.status,
      layout: a.layout,
      targetDevice: a.targetDevice,
      updatedAt: a.updatedAt,
      createdAt: a.createdAt,
    }));

  const draftArticles: DashboardArticle[] = articles
    .filter((a) => a.status === "DRAFT")
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      categoryName: a.categoryName,
      authorName: a.authorName,
      status: a.status,
      layout: a.layout,
      targetDevice: a.targetDevice,
      updatedAt: a.updatedAt,
      createdAt: a.createdAt,
    }));

  // Top 5 articles by views
  const topArticles = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  // Recent audit logs
  const recentLogs = db.auditLogs.slice(0, 6);

  // 7-day view simulation
  const last7Days = [
    { day: "Thu", views: Math.round(totalViews * 0.11) },
    { day: "Fri", views: Math.round(totalViews * 0.14) },
    { day: "Sat", views: Math.round(totalViews * 0.18) },
    { day: "Sun", views: Math.round(totalViews * 0.16) },
    { day: "Mon", views: Math.round(totalViews * 0.13) },
    { day: "Tue", views: Math.round(totalViews * 0.12) },
    { day: "Today", views: Math.round(totalViews * 0.16) },
  ];
  const maxDayViews = Math.max(...last7Days.map((d) => d.views), 1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Editorial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Real-time newsroom analytics, publishing queue, and system overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 bg-[#B80000] hover:bg-[#950000] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Write Article
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-700 text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-sm transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>

      {/* Database & Infrastructure Connection Health Card */}
      <DatabaseHealthCard />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Published Stories
            </span>
            <div className="text-3xl font-serif font-bold text-[#1A1A1A]">
              {publishedCount}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" /> Live on public site
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              In Review Queue
            </span>
            <div className="text-3xl font-serif font-bold text-[#1A1A1A]">
              {reviewCount}
            </div>
            <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> Awaiting editor approval
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Working Drafts
            </span>
            <div className="text-3xl font-serif font-bold text-[#1A1A1A]">
              {draftCount}
            </div>
            <span className="text-[11px] text-neutral-500 font-semibold flex items-center gap-1 mt-1">
              <FileText className="w-3 h-3" /> Author workspaces
            </span>
          </div>
          <div className="w-12 h-12 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Total Readership
            </span>
            <div className="text-3xl font-serif font-bold text-[#B80000]">
              {totalViews.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#B80000] font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Page views tracked
            </span>
          </div>
          <div className="w-12 h-12 bg-red-50 text-[#B80000] rounded-full flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Real-time Writer Activity & Pending Approval Queue */}
      <WriterActivityOverview
        initialReviewArticles={reviewArticles}
        initialDraftArticles={draftArticles}
        isAdmin={isAdmin}
        currentUserId={session?.user?.id}
      />

      {/* Grid: 7-Day Chart & Top 5 Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 7-Day Readership Trend (SVG chart) */}
        <div className="lg:col-span-7 bg-white p-6 border border-neutral-200 rounded-sm shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              Readership Traffic (Last 7 Days)
            </h3>
            <span className="text-xs text-neutral-500 font-medium">Aggregated Impressions</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {last7Days.map((item) => {
              const heightPercent = Math.max(12, Math.round((item.views / maxDayViews) * 100));
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono font-semibold text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.views.toLocaleString()}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-[#1A1A1A] group-hover:bg-[#B80000] rounded-t-sm transition-all duration-300 relative"
                  />
                  <span className="text-xs font-semibold text-neutral-600">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Articles */}
        <div className="lg:col-span-5 bg-white p-6 border border-neutral-200 rounded-sm shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              Top Ranked Stories
            </h3>
            <Link
              href="/admin/articles"
              className="text-xs font-bold text-[#B80000] hover:underline uppercase tracking-wider"
            >
              All Articles &rarr;
            </Link>
          </div>

          <ol className="divide-y divide-neutral-100">
            {topArticles.map((art, idx) => (
              <li key={art.id} className="py-3 first:pt-0 flex items-start gap-3 group">
                <span className="font-serif font-bold text-lg text-neutral-400 group-hover:text-[#B80000] w-5 text-right shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/articles/${art.id}`}
                    className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] group-hover:text-[#B80000] transition-colors line-clamp-1 block"
                  >
                    {art.title}
                  </Link>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-1">
                    <span className="uppercase font-semibold text-neutral-700">{art.categoryName}</span>
                    <span>&bull;</span>
                    <span>{art.views.toLocaleString()} views</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Recent Audit Log Activity */}
      <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#B80000]" />
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              Recent Editorial Actions
            </h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Real-time Audit Trail</span>
        </div>

        <div className="divide-y divide-neutral-100 text-xs">
          {recentLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    log.action === "PUBLISH"
                      ? "bg-emerald-100 text-emerald-800"
                      : log.action === "DELETE"
                      ? "bg-red-100 text-red-800"
                      : log.action === "UPDATE"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {log.action}
                </span>
                <span className="font-medium text-neutral-800">{log.details || log.entity}</span>
              </div>
              <div className="text-neutral-400 font-mono text-[11px] shrink-0">
                {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} &bull; {log.userName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
