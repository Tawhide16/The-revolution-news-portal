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
  PieChart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DbStatusResponse } from "./DatabaseStatusBadge";

export default function DatabaseHealthCard() {
  const [data, setData] = useState<DbStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showTableDetails, setShowTableDetails] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/db-status", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch {
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
  const storage = data?.storage;

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
              Database &amp; 1 GB Storage Health
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
              Live connection status, 1 GB storage quota &amp; table usage breakdown
            </p>
          </div>
        </div>

        <button
          onClick={fetchStatus}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 disabled:opacity-50 transition-colors shadow-2xs self-start sm:self-auto"
          title="Re-test database connection & refresh storage usage"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-neutral-500 ${refreshing ? "animate-spin text-[#B80000]" : ""}`} />
          <span>{refreshing ? "Refreshing..." : "Refresh Status"}</span>
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

        {/* 1 GB Storage Usage Banner & Progress Bar */}
        {storage && (
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#B80000]" />
                <span className="text-xs font-bold text-neutral-900">
                  Database Disk Usage (1 GB Free Quota)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="font-bold text-neutral-900">{storage.usedFormatted}</span>
                <span className="text-neutral-400">/</span>
                <span className="text-neutral-600">{storage.quotaFormatted}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {storage.percentUsed}% used
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-neutral-200 h-3 rounded-full overflow-hidden relative">
              <div
                style={{ width: `${Math.max(1, Math.min(100, storage.percentUsed))}%` }}
                className={`h-full transition-all duration-500 rounded-full ${
                  storage.percentUsed > 80
                    ? "bg-red-600"
                    : storage.percentUsed > 50
                    ? "bg-amber-500"
                    : "bg-emerald-600"
                }`}
              />
            </div>

            {/* 3 Storage Stat Blocks */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="bg-white p-2.5 rounded border border-neutral-200">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500">Total Quota</div>
                <div className="font-mono font-bold text-neutral-900 text-xs sm:text-sm mt-0.5">
                  1.00 GB
                </div>
              </div>
              <div className="bg-white p-2.5 rounded border border-neutral-200">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500">Used Storage</div>
                <div className="font-mono font-bold text-neutral-900 text-xs sm:text-sm mt-0.5">
                  {storage.usedFormatted}
                </div>
              </div>
              <div className="bg-white p-2.5 rounded border border-neutral-200">
                <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">Free Remaining</div>
                <div className="font-mono font-bold text-emerald-700 text-xs sm:text-sm mt-0.5">
                  {storage.remainingFormatted}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4 Infrastructure Metrics Badges */}
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

        {/* Detailed Table Storage Breakdown Toggle */}
        {storage && storage.tables && storage.tables.length > 0 && (
          <div className="pt-2 border-t border-neutral-200 space-y-2">
            <button
              onClick={() => setShowTableDetails(!showTableDetails)}
              className="w-full flex items-center justify-between text-xs font-semibold py-1.5 px-2 rounded hover:bg-neutral-100 transition-colors text-neutral-700 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#B80000]" />
                <span>
                  Table Storage Breakdown ({storage.tables.length} Database Tables)
                </span>
                <span className="font-mono text-[11px] text-neutral-500">
                  Total Tables Size: {storage.tablesTotalFormatted}
                </span>
              </span>
              <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                {showTableDetails ? "Hide Table Usage" : "Show Table Usage"}
                {showTableDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {showTableDetails && (
              <div className="border border-neutral-200 rounded overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-100/90 text-neutral-700 font-semibold uppercase tracking-wider text-[10px] border-b border-neutral-200">
                    <tr>
                      <th className="py-2 px-3">Table Name</th>
                      <th className="py-2 px-3 text-right">Rows</th>
                      <th className="py-2 px-3 text-right">Data Size</th>
                      <th className="py-2 px-3 text-right">Index Size</th>
                      <th className="py-2 px-3 text-right">Total Disk Usage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {storage.tables.map((t) => (
                      <tr key={t.tableName} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-2 px-3 font-semibold text-neutral-900 font-sans">
                          {t.tableName}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-neutral-600">
                          {t.rowCount.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-neutral-500">
                          {t.tableFormatted}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-neutral-500">
                          {t.indexFormatted}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-neutral-900">
                          {t.totalFormatted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
