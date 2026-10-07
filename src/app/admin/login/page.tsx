"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, AlertCircle, ArrowLeft, Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("change_me_first_login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (failedAttempts >= 5) {
      setError("Too many failed attempts. Please wait 30 seconds before retrying.");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (res?.error) {
        setFailedAttempts((prev) => prev + 1);
        setError("Invalid email or password. Please verify your credentials.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
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
        <div className="bg-white py-8 px-6 shadow-sm border border-neutral-300 sm:rounded-sm sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-[#B80000] p-4 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#B80000] mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
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
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold uppercase tracking-wider text-white bg-[#B80000] hover:bg-[#950000] focus:outline-none transition-colors disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Portal"}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Default Credentials (Ready to Test):
            </span>
            <div className="bg-neutral-50 p-3 text-xs border border-neutral-200 space-y-1 font-mono text-neutral-600">
              <div>
                <strong className="text-neutral-900">ADMIN:</strong> admin@example.com / change_me_first_login
              </div>
              <div>
                <strong className="text-neutral-900">EDITOR:</strong> editor@example.com / editor123
              </div>
              <div>
                <strong className="text-neutral-900">AUTHOR:</strong> author@example.com / author123
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-neutral-500 hover:text-[#B80000] inline-flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
