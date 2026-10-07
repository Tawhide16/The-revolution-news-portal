"use client";

import { useState, useEffect } from "react";
import {
  Users as UsersIcon,
  Plus,
  Shield,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  UserCheck,
  UserX,
} from "lucide-react";
import type { Role } from "@/lib/rbac";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // Create form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("AUTHOR");
  const [password, setPassword] = useState("newsroom2026");

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, active: true, password }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `User "${name}" created successfully as ${role}`, type: "success" });
        setName("");
        setEmail("");
        setRole("AUTHOR");
        setShowCreate(false);
        fetchUsers();
      } else {
        setMessage({ text: data.error || "Failed to create user", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error creating user", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setMessage({ text: "Role updated successfully", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to update role", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error updating user role", type: "error" });
    }
  };

  const handleToggleActive = async (user: UserItem) => {
    const nextActive = !user.active;
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, active: nextActive }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, active: nextActive } : u))
        );
        setMessage({
          text: `User ${user.name} is now ${nextActive ? "Active" : "Deactivated"}`,
          type: "success",
        });
      } else {
        setMessage({ text: data.error || "Failed to toggle active state", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error modifying user state", type: "error" });
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (!confirm(`Permanently delete staff account for "${userName}"?`)) return;

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setMessage({ text: `User "${userName}" deleted`, type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to delete user", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error deleting user", type: "error" });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Staff &amp; Access Control</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Admin role management (ADMIN, EDITOR, AUTHOR). Deactivated users are blocked from login.
          </p>
        </div>

        {!showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-[#B80000] hover:bg-[#950000] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            + Add Staff Member
          </button>
        )}
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

      {/* Create User Form */}
      {showCreate && (
        <div className="bg-white p-6 border-2 border-[#1A1A1A] rounded-sm shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Add New Staff User</h3>
            <button
              onClick={() => setShowCreate(false)}
              className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alastair Vance"
                className="w-full p-2.5 text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@revolution.news"
                className="w-full p-2.5 text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Assigned Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full p-2.5 text-sm border border-neutral-300 focus:outline-none focus:border-[#B80000] bg-white"
              >
                <option value="AUTHOR">AUTHOR (Can write own drafts, submit for review)</option>
                <option value="EDITOR">EDITOR (Can publish, edit all articles, categories)</option>
                <option value="ADMIN">ADMIN (Full access including users and settings)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Initial Password *
              </label>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 text-sm font-mono border border-neutral-300 focus:outline-none focus:border-[#B80000]"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:bg-neutral-100 rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#B80000] hover:bg-[#950000] text-white rounded-sm transition-colors shadow-sm"
              >
                {submitting ? "Saving..." : "Create Staff Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-neutral-200 rounded-sm shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#B80000]" />
            Loading staff accounts...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="py-3 px-4">Name &amp; Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-neutral-900 block">{u.name}</span>
                    <span className="text-[11px] font-mono text-neutral-400 mt-0.5 block">{u.email}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      className="text-xs font-semibold uppercase p-1 border border-neutral-300 rounded bg-white"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="AUTHOR">AUTHOR</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        u.active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {u.active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {u.active ? "Active" : "Deactivated"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded border transition-colors ${
                          u.active
                            ? "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                            : "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {u.active ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
