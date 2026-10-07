"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Globe,
  Zap,
  Mail,
  Share2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface SettingsData {
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

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    siteName: "The Revolution",
    tagline: "Fearless, independent public-interest journalism",
    breakingEnabled: true,
    breakingCustomText: "",
    breakingUrl: "",
    contactEmail: "editor@revolution.news",
    twitterUrl: "https://twitter.com/revolution_news",
    facebookUrl: "https://facebook.com/revolution_news",
    youtubeUrl: "https://youtube.com/revolution_news",
    newsletterHeadline: "The Morning Briefing",
    newsletterDescription: "Get essential global analysis delivered to your inbox every dawn.",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({
          text: "Site settings saved successfully. Changes are now live on public pages.",
          type: "success",
        });
      } else {
        setMessage({ text: data.error || "Failed to save settings", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error saving settings", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Site &amp; Editorial Settings</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Configure portal identity, breaking news banners, newsletter text, and social channels.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#B80000] hover:bg-[#950000] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
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

      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#B80000]" />
          Loading portal settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {/* General Site Identity */}
          <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1A1A1A] flex items-center gap-2 border-b border-neutral-200 pb-3">
              <Globe className="w-4 h-4 text-[#B80000]" />
              Brand &amp; Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Site Name *
                </label>
                <input
                  type="text"
                  required
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full p-2.5 text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Contact / Editorial Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full p-2.5 text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Tagline / Editorial Mission
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full p-2.5 text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000]"
                />
              </div>
            </div>
          </div>

          {/* Breaking News Announcement Banner */}
          <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-serif font-bold text-base text-[#1A1A1A] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#B80000]" />
                Breaking News Flash Banner
              </h3>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.breakingEnabled}
                  onChange={(e) => setSettings({ ...settings, breakingEnabled: e.target.checked })}
                  className="rounded border-neutral-300 text-[#B80000] focus:ring-[#B80000]"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Banner Active
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Custom Breaking Headline
                </label>
                <input
                  type="text"
                  value={settings.breakingCustomText}
                  onChange={(e) =>
                    setSettings({ ...settings, breakingCustomText: e.target.value })
                  }
                  placeholder="Leave empty to automatically show latest breaking article..."
                  className="w-full p-2.5 text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Target URL (Internal path or external link)
                </label>
                <input
                  type="text"
                  value={settings.breakingUrl}
                  onChange={(e) => setSettings({ ...settings, breakingUrl: e.target.value })}
                  placeholder="/article/..."
                  className="w-full p-2.5 text-xs font-mono border border-neutral-300 focus:outline-none focus:border-[#B80000]"
                />
              </div>
            </div>
          </div>

          {/* Social Channels & Newsletter */}
          <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1A1A1A] flex items-center gap-2 border-b border-neutral-200 pb-3">
              <Share2 className="w-4 h-4 text-[#B80000]" />
              Social Media &amp; Syndication
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  X (Twitter) Link
                </label>
                <input
                  type="url"
                  value={settings.twitterUrl}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  className="w-full p-2.5 text-xs border border-neutral-300 focus:outline-none focus:border-[#B80000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Facebook Link
                </label>
                <input
                  type="url"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  className="w-full p-2.5 text-xs border border-neutral-300 focus:outline-none focus:border-[#B80000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  YouTube Channel Link
                </label>
                <input
                  type="url"
                  value={settings.youtubeUrl}
                  onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                  className="w-full p-2.5 text-xs border border-neutral-300 focus:outline-none focus:border-[#B80000]"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#B80000] hover:bg-[#950000] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-sm transition-colors shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save All Portal Settings"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
