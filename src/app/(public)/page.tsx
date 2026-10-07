import Link from "next/link";
import { Newspaper, ShieldCheck, ArrowRight, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A] font-sans selection:bg-[#B80000] selection:text-white">
      {/* Top Banner */}
      <header className="border-b border-[#E2E2E2] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="bg-[#B80000] text-white px-3.5 py-1.5 font-bold tracking-widest text-xl uppercase font-serif">
                THE REVOLUTION
              </div>
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold hidden sm:inline-block border-l border-neutral-300 pl-3">
                Independent Journalism
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-neutral-800 bg-[#F2F2F2] hover:bg-neutral-200 transition-colors border border-neutral-300 rounded-sm shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#B80000]" />
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#B80000] border border-red-200 text-xs font-semibold tracking-wider uppercase mb-6">
            System Online &bull; Phase 0 Initialized
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1A1A1A] leading-tight mb-6">
            The Revolution News Portal
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed mb-8 font-sans">
            Next.js 14 App Router, TypeScript strict mode, Prisma ORM with PostgreSQL, Tailwind CSS, and Role-Based Access Control.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#B80000] hover:bg-[#950000] text-white text-sm font-bold uppercase tracking-wider rounded-sm transition-colors shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Open Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E2E2E2]">
            <div className="p-4 bg-[#F2F2F2] rounded-sm">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Database
              </span>
              <p className="font-semibold text-neutral-800">PostgreSQL 16 &amp; Prisma</p>
            </div>
            <div className="p-4 bg-[#F2F2F2] rounded-sm">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Authentication
              </span>
              <p className="font-semibold text-neutral-800">NextAuth v4 + JWT RBAC</p>
            </div>
            <div className="p-4 bg-[#F2F2F2] rounded-sm">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Editor
              </span>
              <p className="font-semibold text-neutral-800">Tiptap Rich-Text Engine</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E2E2] bg-[#1A1A1A] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#B80000]" />
            <span className="font-serif font-bold tracking-wider text-sm">THE REVOLUTION</span>
          </div>
          <p className="text-xs text-neutral-400">
            &copy; 2026 The Revolution. Built to AI Agent Build Specification standards.
          </p>
        </div>
      </footer>
    </div>
  );
}
