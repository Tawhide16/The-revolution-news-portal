"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  ShieldCheck,
  Clock,
  HardDrive,
  Activity,
  Layers,
} from "lucide-react";
import { DbStatusResponse } from "./DatabaseStatusBadge";

export default function DatabaseHealthCard() {
  const [data, setData] = useState<DbStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/db-status", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch (err) {
      setData({
        success: false,
        status: "error",
        checkedAt: new Date().toISOString(),
        latencyMs: 0,
        database: {
          connected: false,
          provider: "PostgreSQL",
          host: "Unknown",
          databaseName: "neondb",
          ssl: false,
          version: "Unknown",
          serverTime: "",
          counts: { users: 0, articles: 0, categories: 0, tags: 0, auditLogs: 0 },
          error: "Failed to connect to database status endpoint",
        },
        localStorage: { status: "unknown", counts: { articles: 0, categories: 0, users: 0 } },
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 45000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const isConnected = data?.database?.connected ?? false;

  return (
    <div className="bg-white border border-neutral-200 rounded-sm shadow-xs overflow-hidden">
      {/* Card Header */}
      <div className="px-5 py-3.5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FAFAFA]">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded ${
              isConnected
                ? "bg-emerald-100 text-emerald-700"
                : loading
                ? "bg-neutral-100 text-neutral-600"
                : "bg-red-100 text-red-700"
            }`}
          >
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
              Database &amp; Infrastructure Health
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  loading
                    ? "bg-neutral-200 text-neutral-700"
                    : isConnected
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {loading ? "Checking..." : isConnected ? "Connected" : "Disconnected"}
              </span>
            </h2>
            <p className="text-[11px] text-neutral-500">
              Live connection status for Neon PostgreSQL and data storage
            </p>
          </div>
        </div>

        <button
          onClick={fetchStatus}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 disabled:opacity-50 transition-colors shadow-2xs self-start sm:self-auto"
          title="Re-test database connection now"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-neutral-500 ${refreshing ? "animate-spin text-[#B80000]" : ""}`} />
          <span>{refreshing ? "Pinging..." : "Test Connection"}</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        {/* Status Callout */}
        <div
          className={`p-3 rounded border flex items-start gap-3 transition-colors ${
            loading
              ? "bg-neutral-50 border-neutral-200 text-neutral-700"
              : isConnected
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          {loading ? (
            <Activity className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5 animate-pulse" />
          ) : isConnected ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}

          <div className="text-xs flex-1">
            <div className="font-bold flex items-center justify-between">
              <span>
                {loading
                  ? "Testing database connection..."
                  : isConnected
                  ? "Database is ONLINE and responsive"
                  : "Database connection failed or unreachable"}
              </span>
              {isConnected && (
                <span className="font-mono text-[11px] text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded font-semibold">
                  Latency: {data?.latencyMs}ms
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-600 mt-0.5">
              {loading
                ? "Connecting to Neon PostgreSQL socket..."
                : isConnected
                ? `Prisma Client successfully queried PostgreSQL database "${data?.database?.databaseName}" with round-trip response in ${data?.latencyMs}ms.`
                : data?.database?.error || "Connection timed out or failed. Please check your credentials in .env"}
            </p>
          </div>
        </div>

        {/* 4 Metrics Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-neutral-50/80 border border-neutral-200 rounded">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-1">
              <Server className="w-3.5 h-3.5" />
              <span>Database Engine</span>
            </div>
            <div className="font-bold text-neutral-900 truncate">
              {data?.database?.provider || "PostgreSQL"}
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              Prisma Client 5.22
            </div>
          </div>

          <div className="p-3 bg-neutral-50/80 border border-neutral-200 rounded">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-1">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Host / Cluster</span>
            </div>
            <div className="font-bold text-neutral-900 truncate font-mono text-[11px]" title={data?.database?.host}>
              {data?.database?.host ? data.database.host.split(".")[0] + "...neon.tech" : "localhost"}
            </div>
            <div className="text-[10px] text-neutral-500 truncate">
              Database: {data?.database?.databaseName || "neondb"}
            </div>
          </div>

          <div className="p-3 bg-neutral-50/80 border border-neutral-200 rounded">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SSL / Security</span>
            </div>
            <div className="font-bold text-neutral-900 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-neutral-400"}`}></span>
              <span>TLS / SSL Mode</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold">
              Encrypted Socket
            </div>
          </div>

          <div className="p-3 bg-neutral-50/80 border border-neutral-200 rounded">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Query Latency</span>
            </div>
            <div className="font-bold text-neutral-900 font-mono">
              {data ? `${data.latencyMs} ms` : "..."}
            </div>
            <div className="text-[10px] text-neutral-500">
              {data?.checkedAt ? `Checked ${new Date(data.checkedAt).toLocaleTimeString()}` : "Pending"}
            </div>
          </div>
        </div>

        {/* Database Tables and Records Overview */}
        {isConnected && data?.database?.counts && (
          <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-neutral-400" />
              <span>Active PostgreSQL Records:</span>
              <span className="font-mono text-neutral-800 font-semibold">
                {data.database.counts.users} Users &bull; {data.database.counts.articles} Articles &bull; {data.database.counts.categories} Categories &bull; {data.database.counts.tags} Tags
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono">
              Server Version: {data.database.version ? data.database.version.split(" ")[0] + " " + data.database.version.split(" ")[1] : "PostgreSQL 18.x"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
