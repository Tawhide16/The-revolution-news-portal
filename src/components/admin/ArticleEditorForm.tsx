"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  Smartphone,
  Monitor,
  Layout,
  Sparkles,
  ShieldCheck,
  PenTool,
} from "lucide-react";
import { createSlug } from "@/lib/slug";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleFormData {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  layout?: "standard" | "hero" | "two-column" | "minimal";
  targetDevice?: "both" | "desktop" | "mobile";
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
  const { data: session } = useSession();
  const userRole = session?.user?.role || "ADMIN";
  const isWriter = userRole === "WRITER" || userRole === "AUTHOR";
  const isAdmin = userRole === "ADMIN";

  const [formData, setFormData] = useState<ArticleFormData>(
    initialData || {
      title: "",
      slug: "",
      summary: "",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
      layout: "standard",
      targetDevice: "both",
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
  const [uploadingInline, setUploadingInline] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [inlineImageModal, setInlineImageModal] = useState(false);
  const [inlineImageUrl, setInlineImageUrl] = useState("");
  const [inlineCaption, setInlineCaption] = useState("");

  useEffect(() => {
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

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingInline(true);
    const data = new FormData();
    data.append("file", file);
    data.append("alt", inlineCaption || file.name);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success && result.url) {
        setInlineImageUrl(result.url);
      } else {
        alert(result.error || "Failed to upload image");
      }
    } catch (err) {
      alert("Error uploading inline image");
    } finally {
      setUploadingInline(false);
    }
  };

  const insertInlineImage = () => {
    if (!inlineImageUrl) return;
    const htmlToInsert = `
<figure class="my-6">
  <img src="${inlineImageUrl}" alt="${inlineCaption || 'Editorial Photo'}" class="w-full rounded shadow-sm" />
  ${inlineCaption ? `<figcaption class="text-xs text-neutral-500 mt-1 italic text-center">${inlineCaption}</figcaption>` : ''}
</figure>
`;
    setFormData((prev) => ({
      ...prev,
      content: prev.content + htmlToInsert,
    }));
    setInlineImageModal(false);
    setInlineImageUrl("");
    setInlineCaption("");
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

    const payloadStatus = isWriter && (overrideStatus === "PUBLISHED" || formData.status === "PUBLISHED")
      ? "REVIEW"
      : (overrideStatus || formData.status);

    const payload = {
      ...formData,
      status: payloadStatus,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = "/api/articles";
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

  const handleAdminQuickApprove = async () => {
    if (!formData.id) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: formData.id, action: "approve" }),
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, status: "PUBLISHED" }));
        alert("Article approved and published live!");
        router.push("/admin/articles");
        router.refresh();
      } else {
        alert(data.error || "Failed to approve article");
      }
    } catch (err) {
      alert("Error approving article");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Role Banner */}
      {isWriter ? (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-sm text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold">Writer Workspace:</span> You can compose stories, upload images, and choose layout styling. Once submitted, your article will be reviewed and approved by an Admin before appearing on the public website.
            </div>
          </div>
          <span className="bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
            Writer Role
          </span>
        </div>
      ) : (
        <div className="bg-neutral-900 text-white px-4 py-2.5 rounded-sm text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <span className="font-bold text-white">Administrator Mode:</span> Full publishing authority, immediate approvals, and layout governance.
            </span>
          </div>
          <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase">
            Admin Authority
          </span>
        </div>
      )}

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
              {isEditing ? `Editing "${initialData?.title}"` : "Draft, upload images, select layout and publish journalism"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Save Draft */}
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("DRAFT")}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-sm transition-colors"
          >
            Save Draft
          </button>

          {/* Writer: Submit for Review / Admin: Mark for Review */}
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("REVIEW")}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-sm transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            {isWriter ? "Submit for Admin Approval" : "Send to Review Queue"}
          </button>

          {/* Admin: Direct Publish or Approve */}
          {isAdmin ? (
            <>
              {formData.status === "REVIEW" && isEditing && (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleAdminQuickApprove}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Approve &amp; Publish Now
                </button>
              )}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit("PUBLISHED")}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#B80000] hover:bg-[#950000] text-white rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {submitting ? "Publishing..." : "Publish Article"}
              </button>
            </>
          ) : null}
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
          {/* Title & Slug */}
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
                placeholder="Key standfirst summary displayed on the front page and search cards..."
                className="w-full p-3 text-xs sm:text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000] leading-relaxed"
              />
              {errors.summary && <p className="text-xs text-red-600 mt-1">{errors.summary}</p>}
            </div>
          </div>

          {/* Article Body Content */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-xs overflow-hidden">
            <div className="bg-neutral-50 border-b border-neutral-200 p-2.5 flex flex-wrap items-center justify-between gap-2">
              {/* Text formatting tools */}
              <div className="flex flex-wrap items-center gap-1">
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

                {/* Inline Image Inserter Button */}
                <button
                  type="button"
                  onClick={() => setInlineImageModal(true)}
                  className="px-2 py-1 text-xs font-semibold bg-neutral-200 hover:bg-[#B80000] hover:text-white rounded transition-colors flex items-center gap-1"
                  title="Insert Image inside Body"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Insert Image</span>
                </button>
              </div>

              {/* View / Preview Controls */}
              <div className="flex items-center gap-2">
                {showPreview && (
                  <div className="flex items-center bg-neutral-200 rounded p-0.5">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("desktop")}
                      className={`p-1 rounded text-xs flex items-center gap-1 ${
                        previewDevice === "desktop" ? "bg-white text-black shadow-xs font-bold" : "text-neutral-600"
                      }`}
                      title="Desktop Preview"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[10px]">Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("mobile")}
                      className={`p-1 rounded text-xs flex items-center gap-1 ${
                        previewDevice === "mobile" ? "bg-white text-black shadow-xs font-bold" : "text-neutral-600"
                      }`}
                      title="Mobile Phone Preview"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[10px]">Mobile</span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                    showPreview ? "bg-[#B80000] text-white" : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showPreview ? "Editor" : "Live Preview"}
                </button>
              </div>
            </div>

            {/* Modal for Inserting Body Image */}
            {inlineImageModal && (
              <div className="p-4 bg-amber-50 border-b border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#B80000]" />
                    Insert Story Photograph Into Body
                  </h4>
                  <button
                    type="button"
                    onClick={() => setInlineImageModal(false)}
                    className="text-xs text-neutral-500 hover:text-black font-bold"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Upload from Computer:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleInlineImageUpload}
                      disabled={uploadingInline}
                      className="text-xs text-neutral-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-neutral-200 cursor-pointer"
                    />
                    {uploadingInline && (
                      <span className="text-[11px] text-[#B80000] font-semibold mt-1 block">
                        Uploading inline image...
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Or Image URL:
                    </label>
                    <input
                      type="text"
                      value={inlineImageUrl}
                      onChange={(e) => setInlineImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-1.5 text-xs border border-neutral-300 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Photo Caption / Attribution:
                  </label>
                  <input
                    type="text"
                    value={inlineCaption}
                    onChange={(e) => setInlineCaption(e.target.value)}
                    placeholder="e.g. Photo by AP News Wire / Geneva Press"
                    className="w-full p-1.5 text-xs border border-neutral-300"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={insertInlineImage}
                    disabled={!inlineImageUrl}
                    className="px-3 py-1.5 bg-[#B80000] text-white text-xs font-bold uppercase tracking-wider rounded disabled:opacity-50"
                  >
                    Insert Into Content
                  </button>
                </div>
              </div>
            )}

            {showPreview ? (
              <div className="p-4 bg-neutral-100 flex justify-center">
                {previewDevice === "mobile" ? (
                  /* Mobile Preview Shell (390px phone frame) */
                  <div className="w-[390px] bg-white border-4 border-neutral-800 rounded-3xl shadow-2xl p-4 overflow-y-auto max-h-[650px]">
                    <div className="w-20 h-1 bg-neutral-300 mx-auto rounded-full mb-3" />
                    <div className="text-[10px] font-bold uppercase text-[#B80000] tracking-wider mb-1">
                      {formData.layout || "Standard"} Layout &bull; Mobile View
                    </div>
                    <h2 className="text-lg font-serif font-bold text-[#1A1A1A] leading-tight mb-2">
                      {formData.title || "Headline preview"}
                    </h2>
                    <p className="text-xs text-neutral-600 mb-3 italic">
                      {formData.summary || "Summary excerpt preview"}
                    </p>
                    {formData.coverImage && (
                      <img
                        src={formData.coverImage}
                        alt="Preview"
                        className="w-full h-44 object-cover rounded mb-3"
                      />
                    )}
                    <div
                      className="prose prose-sm font-serif text-xs leading-relaxed text-neutral-800"
                      dangerouslySetInnerHTML={{ __html: formData.content || "<em>No content written yet.</em>" }}
                    />
                  </div>
                ) : (
                  /* Desktop Preview Shell */
                  <div className="w-full bg-white border border-neutral-200 p-8 rounded shadow-sm max-w-3xl">
                    <div className="text-xs font-bold uppercase text-[#B80000] tracking-wider mb-2">
                      {formData.layout || "Standard"} Layout &bull; Desktop View
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-[#1A1A1A] leading-tight mb-3">
                      {formData.title || "Headline preview"}
                    </h1>
                    <p className="text-base text-neutral-600 leading-relaxed mb-6 font-normal">
                      {formData.summary || "Summary excerpt preview"}
                    </p>
                    {formData.coverImage && (
                      <div className="aspect-[16/9] w-full overflow-hidden rounded bg-neutral-100 mb-6">
                        <img
                          src={formData.coverImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`prose prose-neutral max-w-none font-serif text-base leading-relaxed text-neutral-800 ${
                        formData.layout === "two-column" ? "sm:columns-2 gap-8" : ""
                      }`}
                      dangerouslySetInnerHTML={{ __html: formData.content || "<em>No content written yet.</em>" }}
                    />
                  </div>
                )}
              </div>
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

        {/* Right Sidebar: Layout, Devices, Meta & Taxonomies (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Article Layout & Device Target Selection */}
          <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2 flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-[#B80000]" />
              Layout &amp; Responsive Display
            </h3>

            {/* Layout Style Choice */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Article Layout Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "standard", label: "Standard", desc: "Classic Broadsheet" },
                  { id: "hero", label: "Hero Banner", desc: "Full-width Visual" },
                  { id: "two-column", label: "Two-Column", desc: "Newspaper Print" },
                  { id: "minimal", label: "Minimalist", desc: "Clean Longform" },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, layout: l.id as any })}
                    className={`p-2.5 text-left border rounded transition-all ${
                      formData.layout === l.id
                        ? "border-[#B80000] bg-red-50/50 text-[#B80000] ring-1 ring-[#B80000]"
                        : "border-neutral-200 hover:border-neutral-400 bg-white text-neutral-700"
                    }`}
                  >
                    <span className="font-bold text-xs block">{l.label}</span>
                    <span className="text-[10px] text-neutral-500 block">{l.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Device Target Choice (Mobile / Desktop / Both) */}
            <div className="pt-3 border-t border-neutral-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Target Device Display
              </label>
              <div className="space-y-1.5">
                {[
                  { id: "both", label: "Both (Mobile & Desktop)", icon: Sparkles, desc: "Adaptive responsive view" },
                  { id: "desktop", label: "Desktop Optimized", icon: Monitor, desc: "Curated for wide screens" },
                  { id: "mobile", label: "Mobile First", icon: Smartphone, desc: "Compact handheld format" },
                ].map((dev) => {
                  const Icon = dev.icon;
                  const isSelected = (formData.targetDevice || "both") === dev.id;
                  return (
                    <label
                      key={dev.id}
                      onClick={() => setFormData({ ...formData, targetDevice: dev.id as any })}
                      className={`flex items-center gap-2.5 p-2 border rounded cursor-pointer transition-colors ${
                        isSelected
                          ? "border-[#B80000] bg-red-50/40 text-neutral-900"
                          : "border-neutral-200 hover:bg-neutral-50 text-neutral-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="targetDevice"
                        checked={isSelected}
                        onChange={() => setFormData({ ...formData, targetDevice: dev.id as any })}
                        className="text-[#B80000] focus:ring-[#B80000]"
                      />
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#B80000]" : "text-neutral-500"}`} />
                      <div className="text-xs">
                        <span className="font-semibold block leading-tight">{dev.label}</span>
                        <span className="text-[10px] text-neutral-400">{dev.desc}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Publishing Status & Flags */}
          <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2">
              Publishing Status
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Article Status
              </label>
              {isWriter ? (
                <div className="space-y-2">
                  <select
                    value={formData.status === "PUBLISHED" ? "REVIEW" : formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as ArticleFormData["status"],
                      })
                    }
                    className="w-full p-2 text-xs border border-neutral-300 focus:outline-none focus:border-[#B80000] bg-white font-medium"
                  >
                    <option value="DRAFT">DRAFT (Personal workspace)</option>
                    <option value="REVIEW">REVIEW (Ready for Admin Approval)</option>
                  </select>
                  <p className="text-[11px] text-amber-700 italic">
                    * As a Writer, published status is activated once an Admin approves your story.
                  </p>
                </div>
              ) : (
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as ArticleFormData["status"],
                    })
                  }
                  className="w-full p-2 text-xs border border-neutral-300 focus:outline-none focus:border-[#B80000] bg-white font-medium"
                >
                  <option value="DRAFT">DRAFT (Author workspace)</option>
                  <option value="REVIEW">REVIEW (Awaiting approval)</option>
                  <option value="SCHEDULED">SCHEDULED (Automatic release)</option>
                  <option value="PUBLISHED">PUBLISHED (Live on site)</option>
                  <option value="ARCHIVED">ARCHIVED (Delisted)</option>
                </select>
              )}
            </div>

            {isAdmin && (
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
            )}
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2 flex items-center justify-between">
              <span>Cover Image</span>
              <Upload className="w-3.5 h-3.5 text-neutral-400" />
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
                Upload Image from Computer
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
