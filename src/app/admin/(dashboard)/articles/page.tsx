"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
  Archive,
  Zap,
  Star,
  RefreshCw,
} from "lucide-react";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  categoryName: string;
  authorName: string;
  status: "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  breaking: boolean;
  views: number;
  publishedAt: string;
  createdAt: string;
}

export default function AdminArticlesListPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?search=${encodeURIComponent(search)}&status=${selectedStatus}`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setDeletingId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        setMessage({ text: "Article deleted successfully", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to delete article", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error deleting article", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Published</span>;
      case "REVIEW":
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">In Review</span>;
      case "SCHEDULED":
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Scheduled</span>;
      case "ARCHIVED":
        return <span className="bg-neutral-200 text-neutral-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Archived</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Draft</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Article Management</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Create, edit, publish, schedule, and curate news articles across all categories.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 bg-[#B80000] hover:bg-[#950000] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          + Write New Article
        </Link>
      </div>

      {message && (
        <div
          className={`p-3 text-xs rounded border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 border border-neutral-200 rounded-sm shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {["ALL", "PUBLISHED", "DRAFT", "REVIEW", "ARCHIVED"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                selectedStatus === st
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title, summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 focus:outline-none focus:border-[#B80000]"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-neutral-800 hover:bg-[#B80000] text-white text-xs font-bold uppercase transition-colors rounded-sm"
          >
            Find
          </button>
        </form>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-neutral-200 rounded-sm shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#B80000]" />
            Loading editorial articles...
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-neutral-500 font-serif">No articles match your criteria.</p>
            <Link
              href="/admin/articles/new"
              className="inline-block mt-3 text-xs font-bold uppercase text-[#B80000] hover:underline"
            >
              Create First Article &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-3 px-4">Title &amp; Meta</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Author</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-center">Flags</th>
                  <th className="py-3 px-3 text-right">Views</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-md">
                      <Link
                        href={`/admin/articles/${art.id}`}
                        className="font-serif font-bold text-neutral-900 hover:text-[#B80000] text-sm block leading-snug line-clamp-1"
                      >
                        {art.title}
                      </Link>
                      <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-2">
                        <span>Slug: /{art.slug}</span>
                        <span>&bull;</span>
                        <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                        {art.categoryName}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-neutral-600 font-medium">
                      {art.authorName}
                    </td>

                    <td className="py-3.5 px-3">{getStatusBadge(art.status)}</td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {art.breaking && (
                          <span title="Breaking News" className="text-[#B80000]">
                            <Zap className="w-3.5 h-3.5 fill-[#B80000]" />
                          </span>
                        )}
                        {art.featured && (
                          <span title="Featured Story" className="text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                          </span>
                        )}
                        {!art.breaking && !art.featured && (
                          <span className="text-neutral-300">&mdash;</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-neutral-600">
                      {art.views.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/articles/${art.id}`}
                          className="p-1.5 text-neutral-600 hover:text-[#B80000] hover:bg-neutral-100 rounded transition-colors"
                          title="Edit Article"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          disabled={deletingId === art.id}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
