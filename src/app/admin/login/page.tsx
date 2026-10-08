"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const emailToUse = email.trim();
    const passwordToUse = password;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: emailToUse,
        password: passwordToUse,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
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

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo - Click to go Home */}
        <Link
          href="/"
          className="flex justify-center items-center gap-1.5 mb-4 group hover:opacity-90 transition-opacity"
          title="Return to Home Page"
        >
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
        </Link>

        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">
            Sign In
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Enter your credentials to access your account
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-neutral-300 sm:rounded-sm sm:px-10 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-[#B80000] p-3.5 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#B80000] mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-[#B80000] rounded-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-[#B80000] rounded-none"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 text-sm font-bold uppercase tracking-wider text-white bg-[#1A1A1A] hover:bg-[#B80000] focus:outline-none transition-colors disabled:opacity-50 rounded-none shadow-xs"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-neutral-100">
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
