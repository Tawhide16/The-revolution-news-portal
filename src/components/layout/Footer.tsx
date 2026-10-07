import Link from "next/link";

const FOOTER_CATEGORIES = [
  { name: "Home", href: "/" },
  { name: "World", href: "/category/world" },
  { name: "Politics", href: "/category/politics" },
  { name: "Business", href: "/category/business" },
  { name: "Tech", href: "/category/tech" },
  { name: "Science", href: "/category/science" },
  { name: "Sports", href: "/category/sports" },
  { name: "Entertainment", href: "/category/entertainment" },
  { name: "Opinion", href: "/category/opinion" },
];

const FOOTER_LEGAL = [
  { name: "Terms of Use", href: "#" },
  { name: "About The Revolution", href: "#" },
  { name: "Privacy Policy", href: "#" },
  { name: "Cookies", href: "#" },
  { name: "Accessibility Help", href: "#" },
  { name: "Parental Guidance", href: "#" },
  { name: "Contact Us", href: "#" },
  { name: "Editorial Standards", href: "#" },
  { name: "Admin Portal", href: "/admin/login" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white border-t-4 border-[#B80000] mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Brand & Directory */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-neutral-700 gap-6">
          <div className="flex items-center gap-1.5">
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
              REVOLUTION
            </span>
          </div>

          <div className="text-xs text-neutral-400">
            Independent, fearless public-interest journalism since inception.
          </div>
        </div>

        {/* Categories Bar */}
        <div className="py-6 border-b border-neutral-800">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            {FOOTER_CATEGORIES.map((cat) => (
              <li key={cat.name}>
                <Link
                  href={cat.href}
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
            &copy; 2026 The Revolution. The Revolution is not responsible for the content of external sites. Read about our approach to external linking.
          </p>
          <p className="shrink-0 font-mono text-[11px] text-neutral-600">
            Next.js 14 &bull; PostgreSQL &bull; Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}
