"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-emerald-50 text-emerald-800 text-xs p-3 border border-emerald-200 rounded-sm">
        ✓ You are subscribed to The Revolution Morning Briefing.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="w-full px-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-[#B80000] bg-white"
      />
      <button
        type="submit"
        className="w-full bg-[#1A1A1A] hover:bg-[#B80000] text-white text-xs font-bold py-2 uppercase tracking-wider transition-colors"
      >
        Subscribe Free
      </button>
    </form>
  );
}
