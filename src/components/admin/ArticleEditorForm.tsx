"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  CheckCircle,
  Clock,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  Eye,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Code,
} from "lucide-react";
import { createSlug } from "@/lib/slug";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ArticleFormData {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  categoryId: string;
  tags: string[];
  status: "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  breaking: boolean;
}

interface ArticleEditorFormProps {
  initialData?: ArticleFormData;
  isEditing?: boolean;
}

export default function ArticleEditorForm({
  initialData,
  isEditing = false,
}: ArticleEditorFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ArticleFormData>(
    initialData || {
      title: "",
      slug: "",
      summary: "",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
      categoryId: "",
      tags: [],
      status: "DRAFT",
      featured: false,
      breaking: false,
    }
  );

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags ? initialData.tags.join(", ") : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories) {
          setCategories(data.categories);
          if (!formData.categoryId && data.categories.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: data.categories[0].id }));
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const next = { ...prev, title: val };
      if (!isEditing) {
        next.slug = createSlug(val);
      }
      return next;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append("file", file);
    data.append("alt", formData.title || file.name);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, coverImage: result.url }));
      } else {
        alert(result.error || "Failed to upload image");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const insertFormatting = (tagStart: string, tagEnd: string = "") => {
    const textarea = document.getElementById("article-content-area") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || "formatted text";
    const replacement = `${tagStart}${selected}${tagEnd}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setFormData((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagStart.length, start + tagStart.length + selected.length);
    }, 50);
  };

  const handleSubmit = async (overrideStatus?: ArticleFormData["status"]) => {
    setErrors({});
    setSubmitting(true);

    const payload = {
      ...formData,
      status: overrideStatus || formData.status,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = isEditing ? `/api/articles/${initialData?.id}` : "/api/articles";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/articles");
        router.refresh();
      } else {
        if (data.errors) {
          const formatted: Record<string, string> = {};
          for (const key in data.errors) {
            formatted[key] = Array.isArray(data.errors[key]) ? data.errors[key][0] : data.errors[key];
          }
          setErrors(formatted);
        } else {
          setErrors({ form: data.error || "Failed to save article" });
        }
      }
    } catch (err) {
      setErrors({ form: "Network error occurred while saving." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/articles")}
            className="p-2 text-neutral-500 hover:text-black hover:bg-neutral-200 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">
              {isEditing ? "Edit Article" : "Compose New Article"}
            </h1>
            <p className="text-xs text-neutral-500">
              {isEditing ? `Editing "${initialData?.title}"` : "Draft, format and publish journalism"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("DRAFT")}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-sm transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("REVIEW")}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-sm transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            Submit for Review
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("PUBLISHED")}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#B80000] hover:bg-[#950000] text-white rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {submitting ? "Publishing..." : "Publish Article"}
          </button>
        </div>
      </div>

      {errors.form && (
        <div className="p-3 bg-red-50 border-l-4 border-[#B80000] text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Title, Excerpt, Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Headline (Title) *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter compelling journalistic headline..."
                className="w-full text-lg sm:text-xl font-serif font-bold p-3 border border-neutral-300 focus:outline-none focus:border-[#B80000]"
              />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                URL Slug *
              </label>
              <div className="flex items-center text-xs text-neutral-400 border border-neutral-300 bg-neutral-50 px-3">
                <span>/article/</span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full py-2 bg-transparent text-neutral-800 font-mono text-xs focus:outline-none"
                />
              </div>
              {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Lead Teaser / Summary (Excerpt) *
              </label>
              <textarea
                rows={3}
                required
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Concise 1-2 sentence lead paragraph shown in hero and category grids..."
                className="w-full p-3 text-xs sm:text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000] text-neutral-700"
              />
              {errors.summary && <p className="text-xs text-red-600 mt-1">{errors.summary}</p>}
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-xs overflow-hidden">
            <div className="bg-neutral-100 p-2 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertFormatting("<strong>", "</strong>")}
                  className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded text-xs"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<em>", "</em>")}
                  className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded text-xs"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<h2>", "</h2>")}
                  className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded text-xs"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<h3>", "</h3>")}
                  className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded text-xs"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<blockquote>&ldquo;", "&rdquo;</blockquote>")}
                  className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded text-xs"
                  title="Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<p>", "</p>")}
                  className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded text-xs font-mono font-bold"
                  title="Paragraph"
                >
                  &para;
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<ul>\n  <li>", "</li>\n</ul>")}
                  className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded text-xs"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<code>", "</code>")}
                  className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded text-xs"
                  title="Code Snippet"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  showPreview ? "bg-[#B80000] text-white" : "bg-neutral-200 text-neutral-700"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {showPreview ? "Editor" : "Preview"}
              </button>
            </div>

            {showPreview ? (
              <div
                className="p-6 prose prose-neutral max-w-none min-h-[350px] font-serif text-sm sm:text-base leading-relaxed bg-white"
                dangerouslySetInnerHTML={{ __html: formData.content || "<em>No content written yet.</em>" }}
              />
            ) : (
              <textarea
                id="article-content-area"
                rows={16}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write the full body of the article in HTML or rich paragraphs..."
                className="w-full p-4 font-mono text-xs sm:text-sm border-0 focus:outline-none focus:ring-0 leading-relaxed text-neutral-800 resize-y"
              />
            )}
            {errors.content && <p className="text-xs text-red-600 p-2">{errors.content}</p>}
          </div>
        </div>

        {/* Right Sidebar: Meta & Taxonomies (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing Status & Flags */}
          <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2">
              Publishing Options
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Article Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as ArticleFormData["status"],
                  })
                }
                className="w-full p-2 text-xs border border-neutral-300 focus:outline-none focus:border-[#B80000] bg-white"
              >
                <option value="DRAFT">DRAFT (Author workspace)</option>
                <option value="REVIEW">REVIEW (Ready for editor)</option>
                <option value="SCHEDULED">SCHEDULED (Automatic release)</option>
                <option value="PUBLISHED">PUBLISHED (Live on site)</option>
                <option value="ARCHIVED">ARCHIVED (Delisted)</option>
              </select>
            </div>

            <div className="space-y-3 pt-2 border-t border-neutral-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.breaking}
                  onChange={(e) => setFormData({ ...formData, breaking: e.target.checked })}
                  className="rounded border-neutral-300 text-[#B80000] focus:ring-[#B80000]"
                />
                <span className="text-xs font-semibold text-neutral-800">
                  Mark as Breaking News
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-neutral-300 text-[#B80000] focus:ring-[#B80000]"
                />
                <span className="text-xs font-semibold text-neutral-800">
                  Feature in Top Broadsheet Grid
                </span>
              </label>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2">
              Category &amp; Topics
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Primary Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full p-2 text-xs border border-neutral-300 focus:outline-none focus:border-[#B80000] bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs text-red-600 mt-1">{errors.categoryId}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Article Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Economy, Summit, Trade"
                className="w-full p-2 text-xs border border-neutral-300 focus:outline-none focus:border-[#B80000]"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2">
              Cover Image
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Image URL or Upload
              </label>
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://..."
                className="w-full p-2 text-xs border border-neutral-300 focus:outline-none focus:border-[#B80000] font-mono"
              />
            </div>

            {/* Quick Upload from Disk */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Upload New Image File
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full text-xs text-neutral-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-neutral-200 file:text-neutral-800 hover:file:bg-neutral-300 cursor-pointer"
              />
              {uploadingImage && (
                <span className="text-[11px] text-[#B80000] font-semibold mt-1 block">
                  Uploading image to server...
                </span>
              )}
            </div>

            {formData.coverImage && (
              <div className="mt-2 border border-neutral-200 rounded-sm overflow-hidden aspect-[16/10] relative bg-neutral-100">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
