"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, Menu, X } from "lucide-react";

interface NavCategory {
  id: string;
  name: string;
  slug: string;
}

const DEFAULT_CATEGORIES: NavCategory[] = [
  { id: "c-1", name: "World", slug: "world" },
  { id: "c-2", name: "Politics", slug: "politics" },
  { id: "c-3", name: "Business", slug: "business" },
  { id: "c-4", name: "Tech", slug: "tech" },
  { id: "c-5", name: "Science", slug: "science" },
  { id: "c-6", name: "Sports", slug: "sports" },
  { id: "c-7", name: "Entertainment", slug: "entertainment" },
  { id: "c-8", name: "Opinion", slug: "opinion" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [siteName, setSiteName] = useState("THE REVOLUTION");
  const [categories, setCategories] = useState<NavCategory[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    // Fetch dynamic site settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.siteName) {
          setSiteName(data.settings.siteName.toUpperCase());
        }
      })
      .catch(() => {});

    // Fetch dynamic categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="bg-white border-b border-[#E2E2E2] sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="border-b border-[#EEEEEE] bg-[#FAFAFA] text-xs text-neutral-600 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-medium text-neutral-800">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="text-neutral-300">|</span>
            <span className="text-neutral-500">Global Edition</span>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/admin"
              className="hover:text-[#B80000] flex items-center gap-1.5 transition-colors font-medium text-neutral-700"
            >
              <User className="w-3.5 h-3.5 text-[#B80000]" />
              <span className="font-bold">Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile menu button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-700 hover:text-black focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Center Brand Logo (BBC Block Style) */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 group">
              <div className="flex items-center gap-1">
                <span className="bg-[#B80000] text-white font-serif font-black text-xl sm:text-2xl px-2.5 py-1 inline-flex items-center justify-center leading-none">
                  T
                </span>
                <span className="bg-[#B80000] text-white font-serif font-black text-xl sm:text-2xl px-2.5 py-1 inline-flex items-center justify-center leading-none">
                  H
                </span>
                <span className="bg-[#B80000] text-white font-serif font-black text-xl sm:text-2xl px-2.5 py-1 inline-flex items-center justify-center leading-none">
                  E
                </span>
              </div>
              <span className="text-[#1A1A1A] font-serif font-black tracking-tight text-2xl sm:text-3xl ml-1 group-hover:text-[#B80000] transition-colors">
                {siteName.replace(/^THE\s*/i, "") || "REVOLUTION"}
              </span>
            </Link>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-700 hover:bg-[#F2F2F2] rounded transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-neutral-600" />
              <span className="hidden md:inline text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Search
              </span>
            </button>

            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#B80000] text-white hover:bg-[#950000] transition-colors rounded-sm shadow-xs"
            >
              Admin Portal
            </Link>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {searchOpen && (
          <div className="py-3 px-2 border-t border-[#EEEEEE] bg-neutral-50 animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search stories, topics, analysis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-neutral-300 focus:outline-none focus:border-[#B80000] text-sm"
                autoFocus
              />
              <button
                type="submit"
                className="bg-[#B80000] text-white px-5 py-2 text-sm font-semibold hover:bg-[#950000] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Primary Category Navigation Bar */}
      <nav className="border-t border-[#E2E2E2] bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
            <li>
              <Link
                href="/"
                className="inline-block py-2.5 px-3 text-sm font-semibold tracking-normal text-[#B80000] border-b-2 border-[#B80000]"
              >
                Home
              </Link>
            </li>
            {categories.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/category/${item.slug}`}
                  className="inline-block py-2.5 px-3 text-sm font-semibold tracking-normal text-[#1A1A1A] hover:text-[#B80000] hover:border-b-2 hover:border-[#B80000] transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E2E2] bg-white px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 text-base font-semibold text-[#B80000] hover:bg-[#F2F2F2] rounded"
          >
            Home
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/category/${item.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-base font-semibold text-neutral-800 hover:bg-[#F2F2F2] rounded"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-neutral-200">
            <Link
              href="/admin"
              className="block py-2.5 px-3 text-center bg-[#B80000] text-white font-bold text-sm uppercase tracking-wider rounded-sm"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
