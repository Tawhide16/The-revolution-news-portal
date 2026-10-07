"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ShieldCheck, AlertCircle, ArrowLeft, Lock, Mail, ArrowRight, Zap } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("change_me_first_login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (loginEmail?: string, loginPassword?: string) => {
    setError("");
    setLoading(true);

    const emailToUse = loginEmail || email.trim();
    const passwordToUse = loginPassword || password;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: emailToUse,
        password: passwordToUse,
      });

      if (res?.error) {
        setError("Invalid email or password. Please verify your credentials.");
        setLoading(false);
      } else {
        // Direct browser navigation sets and transmits the session cookie cleanly
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("An unexpected error occurred during sign in.");
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <div className="flex justify-center items-center gap-1.5 mb-3">
          <div className="flex items-center gap-1">
            <span className="bg-[#B80000] text-white font-serif font-black text-2xl px-2.5 py-1">
              T
            </span>
            <span className="bg-[#B80000] text-white font-serif font-black text-2xl px-2.5 py-1">
              H
            </span>
            <span className="bg-[#B80000] text-white font-serif font-black text-2xl px-2.5 py-1">
              E
            </span>
          </div>
          <span className="font-serif font-black text-3xl tracking-tight text-[#1A1A1A]">
            REVOLUTION
          </span>
        </div>

        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-200 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B80000]" />
            Editorial Content Management System
          </span>
          <h2 className="mt-3 text-2xl font-serif font-bold text-[#1A1A1A]">
            Sign in to Admin Portal
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-neutral-300 sm:rounded-sm sm:px-10 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-[#B80000] p-4 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#B80000] mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Fast Login Option */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleLogin("admin@example.com", "change_me_first_login")}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-[#B80000] bg-red-50 hover:bg-red-100 text-[#B80000] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shadow-xs"
          >
            <Zap className="w-4 h-4 fill-[#B80000]" />
            <span>Instant Sign In as Admin</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-400 font-semibold tracking-wider">
                Or Sign In With Email
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-[#B80000]"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-[#B80000]"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold uppercase tracking-wider text-white bg-[#1A1A1A] hover:bg-[#B80000] focus:outline-none transition-colors disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Portal"}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-neutral-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Test Accounts (Click to Fill):
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@example.com");
                  setPassword("change_me_first_login");
                }}
                className="p-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded text-center text-neutral-800 font-bold"
              >
                ADMIN
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("editor@example.com");
                  setPassword("editor123");
                }}
                className="p-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded text-center text-neutral-800 font-bold"
              >
                EDITOR
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("author@example.com");
                  setPassword("author123");
                }}
                className="p-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded text-center text-neutral-800 font-bold"
              >
                AUTHOR
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-neutral-500 hover:text-[#B80000] inline-flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
