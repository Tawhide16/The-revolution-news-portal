"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle,
  FileEdit,
  PenTool,
  Eye,
  AlertCircle,
  Sparkles,
  Smartphone,
  Monitor,
  Layout,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface DashboardArticle {
  id: string;
  title: string;
  slug: string;
  categoryName: string;
  authorName: string;
  status: "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  layout?: string;
  targetDevice?: string;
  updatedAt: string;
  createdAt: string;
}

interface WriterActivityOverviewProps {
  initialReviewArticles: DashboardArticle[];
  initialDraftArticles: DashboardArticle[];
  isAdmin: boolean;
  currentUserId?: string;
}

export default function WriterActivityOverview({
  initialReviewArticles,
  initialDraftArticles,
  isAdmin,
  currentUserId,
}: WriterActivityOverviewProps) {
  const router = useRouter();
  const [reviewArticles, setReviewArticles] = useState<DashboardArticle[]>(initialReviewArticles);
  const [draftArticles, setDraftArticles] = useState<DashboardArticle[]>(initialDraftArticles);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleApprove = async (id: string, title: string) => {
    setProcessingId(id);
    setFeedback(null);
    try {
      const res = await fetch("/api/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "approve" }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewArticles((prev) => prev.filter((a) => a.id !== id));
        setFeedback({
          text: `"${title}" has been approved and is now live on the public website!`,
          type: "success",
        });
        router.refresh();
      } else {
        setFeedback({ text: data.error || "Failed to approve article", type: "error" });
      }
    } catch (err) {
      setFeedback({ text: "Error executing approval", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const getDeviceIcon = (device?: string) => {
    switch (device) {
      case "mobile":
        return (
          <span title="Mobile Only">
            <Smartphone className="w-3 h-3 text-purple-600" />
          </span>
        );
      case "desktop":
        return (
          <span title="Desktop Only">
            <Monitor className="w-3 h-3 text-blue-600" />
          </span>
        );
      default:
        return (
          <span title="Mobile & Desktop (Both)">
            <Sparkles className="w-3 h-3 text-emerald-600" />
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`p-3.5 text-xs rounded border flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
              : "bg-red-50 text-red-800 border-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="font-medium">{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold text-neutral-400 hover:text-neutral-700"
          >
            &times;
          </button>
        </div>
      )}

      {/* 1. Pending Approvals Queue */}
      <div className="bg-white border border-neutral-200 rounded-sm shadow-xs overflow-hidden">
        <div className="p-4 bg-neutral-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <div>
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                Writer Submissions Awaiting Approval
                <span className="bg-[#B80000] text-white text-[11px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {reviewArticles.length}
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Stories written and submitted by writers. Only visible to public once an Admin approves them.
              </p>
            </div>
          </div>

          <Link
            href="/admin/articles?status=REVIEW"
            className="text-xs text-amber-400 hover:underline uppercase tracking-wider font-bold self-start sm:self-auto"
          >
            View All Pending &rarr;
          </Link>
        </div>

        {reviewArticles.length === 0 ? (
          <div className="p-8 text-center bg-neutral-50/50">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-serif font-bold text-neutral-700">All Writer Submissions Are Reviewed</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              No articles are currently waiting in the review queue.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-2.5 px-4">Headline &amp; Slug</th>
                  <th className="py-2.5 px-3">Writer</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Layout &amp; Device</th>
                  <th className="py-2.5 px-3">Submitted</th>
                  <th className="py-2.5 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {reviewArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4 max-w-sm">
                      <Link
                        href={`/admin/articles/${art.id}`}
                        className="font-serif font-bold text-sm text-[#1A1A1A] hover:text-[#B80000] block line-clamp-1"
                      >
                        {art.title}
                      </Link>
                      <span className="text-[10px] font-mono text-neutral-400">/{art.slug}</span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                        <PenTool className="w-3 h-3 text-amber-700" />
                        <span>{art.authorName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="bg-neutral-100 text-neutral-700 text-[11px] px-2 py-0.5 rounded font-medium">
                        {art.categoryName}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                        {getDeviceIcon(art.targetDevice)}
                        <span className="capitalize font-medium">{art.layout || "standard"}</span>
                        <span className="text-neutral-400">({art.targetDevice || "both"})</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-neutral-500 text-[11px]">
                      {new Date(art.updatedAt || art.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/articles/${art.id}`}
                          className="px-2.5 py-1 text-neutral-700 hover:text-black bg-neutral-100 hover:bg-neutral-200 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Review
                        </Link>

                        {isAdmin && (
                          <button
                            onClick={() => handleApprove(art.id, art.title)}
                            disabled={processingId === art.id}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 shadow-xs transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="w-3 h-3" />
                            {processingId === art.id ? "Approving..." : "Approve & Publish"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Writers Currently Drafting (Real-time newsroom writing activity) */}
      <div className="bg-white border border-neutral-200 rounded-sm shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
          <div className="flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-[#B80000]" />
            <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
              Writer Workspaces &amp; Drafts in Progress
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono">
              ({draftArticles.length} active drafts)
            </span>
          </div>
          <Link
            href="/admin/articles/new"
            className="text-xs font-bold uppercase tracking-wider text-[#B80000] hover:underline"
          >
            + New Draft &rarr;
          </Link>
        </div>

        {draftArticles.length === 0 ? (
          <p className="text-xs text-neutral-500 py-3 italic">
            No writers currently have active drafts in progress.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {draftArticles.slice(0, 6).map((draft) => (
              <div
                key={draft.id}
                className="p-3 border border-neutral-200 hover:border-[#B80000] rounded-sm transition-colors bg-neutral-50/50 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1.5">
                    <span className="font-semibold text-neutral-700 flex items-center gap-1">
                      <PenTool className="w-2.5 h-2.5 text-neutral-400" />
                      {draft.authorName}
                    </span>
                    <span className="bg-neutral-200 text-neutral-700 px-1.5 py-0.2 rounded font-bold uppercase text-[9px]">
                      Drafting
                    </span>
                  </div>

                  <Link
                    href={`/admin/articles/${draft.id}`}
                    className="font-serif font-bold text-xs text-[#1A1A1A] group-hover:text-[#B80000] line-clamp-2 leading-snug"
                  >
                    {draft.title || "Untitled Draft"}
                  </Link>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-neutral-200 text-[10px] text-neutral-400">
                  <div className="flex items-center gap-1">
                    {getDeviceIcon(draft.targetDevice)}
                    <span className="capitalize">{draft.layout || "standard"}</span>
                  </div>
                  <span>
                    Updated: {new Date(draft.updatedAt || draft.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
