import Link from "next/link";
import { getDb } from "@/lib/store";

export default function Footer() {
  const db = getDb();
  const siteName = db.settings?.siteName || "The Revolution";
  const categories = db.categories || [];

  const FOOTER_LEGAL = [
    { name: "Terms of Use", href: "#" },
    { name: "About The Revolution", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Cookies", href: "#" },
    { name: "Accessibility Help", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "Editorial Standards", href: "#" },
    { name: "Sign In", href: "/admin/login" },
  ];

  return (
    <footer className="bg-[#1A1A1A] text-white border-t-4 border-[#B80000] mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Brand & Mission */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-neutral-700 gap-6">
          <Link href="/" className="flex items-center gap-1.5 group hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-1">
              <span className="bg-[#B80000] text-white font-serif font-black text-xl px-2.5 py-1 inline-flex items-center justify-center">
                T
              </span>
              <span className="bg-[#B80000] text-white font-serif font-black text-xl px-2.5 py-1 inline-flex items-center justify-center">
                H
              </span>
              <span className="bg-[#B80000] text-white font-serif font-black text-xl px-2.5 py-1 inline-flex items-center justify-center">
                E
              </span>
            </div>
            <span className="text-white font-serif font-bold text-2xl tracking-tight ml-1">
              {siteName.replace(/^THE\s*/i, "") || "REVOLUTION"}
            </span>
          </Link>

          <div className="text-xs text-neutral-400">
            {db.settings?.tagline || "Independent, fearless public-interest journalism since inception."}
          </div>
        </div>

        {/* Categories Directory */}
        <div className="py-6 border-b border-neutral-800">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <li>
              <Link href="/" className="text-neutral-300 hover:text-white hover:underline transition-colors">
                Home
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="text-neutral-300 hover:text-white hover:underline transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal & Policy Links */}
        <div className="py-6 border-b border-neutral-800">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-400">
            {FOOTER_LEGAL.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="hover:text-neutral-200 hover:underline transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright notice */}
        <div className="pt-6 text-xs text-neutral-500 leading-relaxed flex flex-col sm:flex-row justify-between gap-4">
          <p>
            &copy; 2026 {siteName}. All rights reserved. The Revolution is not responsible for the content of external sites.
          </p>
          <p className="shrink-0 font-mono text-[11px] text-neutral-600">
            Next.js 14 &bull; Admin CMS Engine
          </p>
        </div>
      </div>
    </footer>
  );
}
