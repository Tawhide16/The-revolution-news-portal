"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag as TagIcon, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { createSlug } from "@/lib/slug";

interface TagData {
  id: string;
  name: string;
  slug: string;
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagName, setTagName] = useState("");
  const [tagSlug, setTagSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      if (data.success) {
        setTags(data.tags);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleNameChange = (val: string) => {
    setTagName(val);
    setTagSlug(createSlug(val));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagName, slug: tagSlug || createSlug(tagName) }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `Tag "${tagName}" created`, type: "success" });
        setTagName("");
        setTagSlug("");
        fetchTags();
      } else {
        setMessage({ text: data.error || "Failed to create tag", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error creating tag", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete tag "${name}"?`)) return;
    setMessage(null);

    try {
      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTags((prev) => prev.filter((t) => t.id !== id));
        setMessage({ text: `Tag "${name}" deleted`, type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to delete tag", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error deleting tag", type: "error" });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-neutral-200">
        <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Tag Taxonomy</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Keywords and topics used across articles for cross-referencing and search indexation.
        </p>
      </div>

      {message && (
        <div
          className={`p-3 text-xs rounded border flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Add Tag Form (5 cols) */}
        <div className="md:col-span-5 bg-white p-5 border border-neutral-200 rounded-sm shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#1A1A1A] border-b border-neutral-200 pb-2">
            Create New Tag
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Tag Label *
              </label>
              <input
                type="text"
                required
                value={tagName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Geopolitics"
                className="w-full p-2 text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                required
                value={tagSlug}
                onChange={(e) => setTagSlug(e.target.value)}
                className="w-full p-2 text-xs font-mono border border-neutral-300 focus:outline-none focus:border-[#B80000]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-[#B80000] hover:bg-[#950000] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shadow-sm"
            >
              {submitting ? "Adding..." : "+ Add Tag"}
            </button>
          </form>
        </div>

        {/* Existing Tags Cloud & List (7 cols) */}
        <div className="md:col-span-7 bg-white p-5 border border-neutral-200 rounded-sm shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
              Active Tags ({tags.length})
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono">In Database</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#B80000]" />
              Loading tags...
            </div>
          ) : tags.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400">No tags created yet.</div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs px-3 py-1.5 rounded-sm flex items-center gap-2 transition-colors"
                >
                  <TagIcon className="w-3 h-3 text-[#B80000]" />
                  <span className="font-medium">{tag.name}</span>
                  <button
                    onClick={() => handleDelete(tag.id, tag.name)}
                    className="text-neutral-400 hover:text-red-600 transition-colors ml-1"
                    title="Delete tag"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
