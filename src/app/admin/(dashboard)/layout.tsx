"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tag,
  Image as ImageIcon,
  Users,
  Settings,
  ClipboardList,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import SessionWrapper from "@/components/admin/SessionWrapper";
import type { Role } from "@/lib/rbac";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole: Role = (session?.user?.role as Role) || "ADMIN";
  const userName = session?.user?.name || "Editorial Staff";
  const userEmail = session?.user?.email || "admin@example.com";

  // Filter menu items by role
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, show: true },
    { name: "Articles", href: "/admin/articles", icon: FileText, show: true },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
      show: userRole === "ADMIN" || userRole === "EDITOR",
    },
    {
      name: "Tags",
      href: "/admin/tags",
      icon: Tag,
      show: userRole === "ADMIN" || userRole === "EDITOR",
    },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon, show: true },
    { name: "Users & Roles", href: "/admin/users", icon: Users, show: userRole === "ADMIN" },
    { name: "Site Settings", href: "/admin/settings", icon: Settings, show: userRole === "ADMIN" },
    {
      name: "Audit Log",
      href: "/admin/audit",
      icon: ClipboardList,
      show: userRole === "ADMIN",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-0 -translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-800">
            <Link href="/" className="flex items-center gap-1.5 group hover:opacity-90 transition-opacity" title="Go to Public Portal Home">
              <div className="flex items-center gap-0.5">
                <span className="bg-[#B80000] text-white font-serif font-black text-sm px-1.5 py-0.5">
                  T
                </span>
                <span className="bg-[#B80000] text-white font-serif font-black text-sm px-1.5 py-0.5">
                  H
                </span>
                <span className="bg-[#B80000] text-white font-serif font-black text-sm px-1.5 py-0.5">
                  E
                </span>
              </div>
              <span className="font-serif font-bold text-lg tracking-wider text-white">
                REVOLUTION
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Mini Card */}
          <div className="p-4 mx-3 my-4 bg-neutral-900 border border-neutral-800 rounded-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#B80000] text-white flex items-center justify-center font-bold text-sm">
                {userName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-semibold truncate text-white">{userName}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      userRole === "ADMIN"
                        ? "bg-red-950 text-red-300 border border-red-800"
                        : userRole === "EDITOR"
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-blue-950 text-blue-300 border border-blue-800"
                    }`}
                  >
                    {userRole}
                  </span>
                  <span className="text-[10px] text-neutral-400 truncate">{userEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems
              .filter((item) => item.show)
              .map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#B80000] text-white font-semibold"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* Bottom Utility Tools */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Live Site
            </span>
            <span className="text-[10px] text-neutral-500">Opens tab</span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E2E2E2] flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Editorial Desk
              </span>
              <span className="text-neutral-300">&bull;</span>
              <span className="text-xs font-mono text-neutral-400">Next.js 14 Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/articles/new"
              className="bg-[#B80000] hover:bg-[#950000] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>+ New Article</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-neutral-700 hover:text-[#B80000] flex items-center gap-1.5 transition-colors hidden sm:flex"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionWrapper>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionWrapper>
  );
}
