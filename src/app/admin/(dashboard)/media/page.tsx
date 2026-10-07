"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Trash2,
  Check,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  name: string;
  alt: string;
  sizeBytes: number;
  createdAt: string;
  uploadedBy: string;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [altInput, setAltInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      if (data.success) {
        setMediaList(data.media);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", altInput || file.name);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `File "${file.name}" uploaded successfully`, type: "success" });
        setAltInput("");
        fetchMedia();
      } else {
        setMessage({ text: data.error || "Upload failed", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error uploading file", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/upload?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
        setMessage({ text: "Media item deleted", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to delete media", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error deleting media", type: "error" });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Media Asset Library</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Store, preview, and copy image assets for article headers and editorial layouts.
          </p>
        </div>
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
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-base text-[#1A1A1A] flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#B80000]" />
          Upload New Image
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Alt Text / Description (SEO)
            </label>
            <input
              type="text"
              value={altInput}
              onChange={(e) => setAltInput(e.target.value)}
              placeholder="e.g. Delegates signing peace accords at summit"
              className="w-full p-2 text-xs border border-neutral-300 focus:outline-none focus:border-[#B80000]"
            />
          </div>

          <div className="md:col-span-7">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Select Image File (JPEG, PNG, WEBP &bull; Max 5 MB)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-[#B80000] file:text-white hover:file:bg-[#950000] cursor-pointer"
            />
          </div>
        </div>

        {uploading && (
          <div className="flex items-center gap-2 text-xs text-[#B80000] font-semibold pt-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Uploading and optimizing image...
          </div>
        )}
      </div>

      {/* Media Grid */}
      <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
          <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
            Uploaded Assets ({mediaList.length})
          </h3>
          <span className="text-[11px] text-neutral-400 font-mono">Storage: Local/Cloud</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#B80000]" />
            Loading media library...
          </div>
        ) : mediaList.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No media uploaded yet. Use the upload box above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="group border border-neutral-200 rounded-sm overflow-hidden bg-neutral-50 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] bg-neutral-200 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt || item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                    {formatFileSize(item.sizeBytes)}
                  </span>
                </div>

                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900 truncate" title={item.name}>
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500 truncate" title={item.alt}>
                      {item.alt || "No alt text"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                    <button
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                        copiedId === item.id ? "text-emerald-600" : "text-neutral-700 hover:text-[#B80000]"
                      }`}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy URL
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
