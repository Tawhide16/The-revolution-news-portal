"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, FolderTree, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { createSlug } from "@/lib/slug";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form inputs
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formOrder, setFormOrder] = useState(0);

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setFormOrder(categories.length + 1);
    setIsCreating(true);
    setMessage(null);
  };

  const openEdit = (cat: CategoryData) => {
    setIsCreating(false);
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description || "");
    setFormOrder(cat.order || 0);
    setMessage(null);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingCategory(null);
    setMessage(null);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (isCreating) {
      setFormSlug(createSlug(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      name: formName,
      slug: formSlug || createSlug(formName),
      description: formDesc,
      order: Number(formOrder) || 0,
    };

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({
          text: editingCategory ? "Category updated successfully" : "Category created successfully",
          type: "success",
        });
        cancelForm();
        fetchCategories();
      } else {
        setMessage({ text: data.error || "Failed to save category", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error occurred", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    setMessage(null);

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `Category "${name}" deleted successfully`, type: "success" });
        fetchCategories();
      } else {
        setMessage({ text: data.error || "Failed to delete category", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error deleting category", type: "error" });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Category Taxonomy</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Organize journalistic sections. Deleting is protected if articles are active.
          </p>
        </div>

        {!isCreating && !editingCategory && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#B80000] hover:bg-[#950000] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            + Add New Category
          </button>
        )}
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

      {/* Inline Form (Create or Edit) */}
      {(isCreating || editingCategory) && (
        <div className="bg-white p-6 border-2 border-[#1A1A1A] rounded-sm shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
            </h3>
            <button
              onClick={cancelForm}
              className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Technology & Science"
                className="w-full p-2.5 text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                URL Slug *
              </label>
              <div className="flex items-center text-xs text-neutral-400 border border-neutral-300 bg-neutral-50 px-3">
                <span>/category/</span>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full py-2 bg-transparent text-neutral-800 font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Brief summary of topics covered in this section..."
                className="w-full p-2.5 text-xs sm:text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Display Order Priority
              </label>
              <input
                type="number"
                value={formOrder}
                onChange={(e) => setFormOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2.5 text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000]"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:bg-neutral-100 rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#B80000] hover:bg-[#950000] text-white rounded-sm transition-colors shadow-sm"
              >
                {submitting ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white border border-neutral-200 rounded-sm shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#B80000]" />
            Loading categories...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="py-3 px-4 w-16">Order</th>
                <th className="py-3 px-4">Name &amp; Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-400">
                    #{cat.order}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-serif font-bold text-sm text-[#1A1A1A] block">
                      {cat.name}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 mt-0.5 block">
                      /category/{cat.slug}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 max-w-sm">
                    {cat.description || <em className="text-neutral-400">No description</em>}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 text-neutral-600 hover:text-[#B80000] hover:bg-neutral-100 rounded transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
