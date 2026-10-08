"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Server,
  ShieldCheck,
  Clock,
  Layers,
  HardDrive,
  PieChart,
} from "lucide-react";

export interface TableStorageInfo {
  tableName: string;
  totalBytes: number;
  tableBytes: number;
  indexBytes: number;
  totalFormatted: string;
  tableFormatted: string;
  indexFormatted: string;
  rowCount: number;
  percentOfUsed: number;
}

export interface StorageMetrics {
  quotaBytes: number;
  quotaFormatted: string;
  usedBytes: number;
  usedFormatted: string;
  remainingBytes: number;
  remainingFormatted: string;
  percentUsed: number;
  tablesTotalBytes: number;
  tablesTotalFormatted: string;
  systemOverheadBytes: number;
  systemOverheadFormatted: string;
  tables: TableStorageInfo[];
}

export interface DbStatusResponse {
  success: boolean;
  status: "connected" | "error";
  checkedAt: string;
  latencyMs: number;
  database: {
    connected: boolean;
    provider: string;
    host: string;
    databaseName: string;
    ssl: boolean;
    version: string;
    serverTime: string;
    counts: {
      users: number;
      articles: number;
      categories: number;
      tags: number;
      auditLogs: number;
    };
    error: string | null;
  };
  storage?: StorageMetrics;
  localStorage: {
    status: string;
    counts: {
      articles: number;
      categories: number;
      users: number;
    };
  };
}

export default function DatabaseStatusBadge() {
  const [data, setData] = useState<DbStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
          error: "Failed to communicate with DB status API",
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
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const isConnected = data?.database?.connected ?? false;
  const storage = data?.storage;

  return (
    <>
      {/* Navbar Status Pill Button */}
      <button
        onClick={() => setModalOpen(true)}
        className={`group inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer shadow-xs ${
          loading
            ? "bg-neutral-50 text-neutral-600 border-neutral-200"
            : isConnected
            ? "bg-emerald-50/90 text-emerald-800 border-emerald-300 hover:bg-emerald-100/90"
            : "bg-red-50 text-red-800 border-red-300 hover:bg-red-100"
        }`}
        title="Click to view detailed Database Connection Diagnostics & 1 GB Storage Usage"
      >
        <span className="relative flex h-2 w-2">
          {isConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              loading
                ? "bg-neutral-400"
                : isConnected
                ? "bg-emerald-600"
                : "bg-red-600"
            }`}
          ></span>
        </span>

        <span className="flex items-center gap-1 font-mono text-[11px]">
          <Database className="w-3 h-3 text-neutral-500 group-hover:text-neutral-800" />
          <span>DB:</span>
          {loading ? (
            <span className="text-neutral-500">Checking...</span>
          ) : isConnected ? (
            <span className="font-semibold text-emerald-700">
              Online ({data?.latencyMs}ms)
              {storage && (
                <span className="ml-1 text-[10px] text-neutral-500 font-normal">
                  &bull; {storage.usedFormatted}
                </span>
              )}
            </span>
          ) : (
            <span className="font-semibold text-red-700">Offline</span>
          )}
        </span>
      </button>

      {/* Connection & Storage Diagnostic Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-lg shadow-2xl border border-neutral-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-md ${
                    isConnected ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Database Diagnostics &amp; 1 GB Storage Monitor
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    PostgreSQL Server Health, Disk Quota &amp; Table Analytics
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md hover:bg-neutral-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Primary Status Banner */}
              <div
                className={`p-3.5 rounded-md border flex items-start gap-3 ${
                  isConnected
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                    : "bg-red-50 border-red-200 text-red-900"
                }`}
              >
                {isConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-0.5 flex-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>
                      {isConnected
                        ? "PostgreSQL Database Connected Successfully"
                        : "Database Connection Failed"}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                        isConnected
                          ? "bg-emerald-200 text-emerald-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {isConnected ? `Ping: ${data?.latencyMs}ms` : "Down"}
                    </span>
                  </div>
                  <p className="text-neutral-600">
                    {isConnected
                      ? "Neon PostgreSQL instance is healthy, accepting Prisma queries, and responding normally."
                      : data?.database?.error ||
                        "Unable to establish handshake with PostgreSQL server. Check DATABASE_URL and network."}
                  </p>
                </div>
              </div>

              {/* 1 GB Storage Quota Meter */}
              {storage && (
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                      <PieChart className="w-4 h-4 text-[#B80000]" />
                      <span>1 GB Free Tier Storage Quota</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-neutral-800">
                      {storage.usedFormatted} / {storage.quotaFormatted} ({storage.percentUsed}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden relative">
                    <div
                      style={{ width: `${Math.max(1, Math.min(100, storage.percentUsed))}%` }}
                      className={`h-full transition-all duration-500 rounded-full ${
                        storage.percentUsed > 85
                          ? "bg-red-600"
                          : storage.percentUsed > 60
                          ? "bg-amber-500"
                          : "bg-emerald-600"
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-600">
                    <span>
                      Used: <strong className="text-neutral-900 font-mono">{storage.usedFormatted}</strong>
                    </span>
                    <span>
                      Free Remaining: <strong className="text-emerald-700 font-mono">{storage.remainingFormatted}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-md">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-medium mb-1">
                    <Server className="w-3.5 h-3.5" />
                    <span>Engine & Provider</span>
                  </div>
                  <div className="font-semibold text-neutral-900 truncate">
                    {data?.database?.provider || "PostgreSQL"}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono truncate">
                    Prisma ORM Client
                  </div>
                </div>

                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-md">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-medium mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SSL Security</span>
                  </div>
                  <div className="font-semibold text-neutral-900 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>SSL/TLS Required</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono truncate">
                    channel_binding=require
                  </div>
                </div>

                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-md">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-medium mb-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>Database Host</span>
                  </div>
                  <div className="font-semibold text-neutral-900 truncate font-mono text-[11px]">
                    {data?.database?.databaseName || "neondb"}
                  </div>
                  <div
                    className="text-[10px] text-neutral-500 font-mono truncate"
                    title={data?.database?.host}
                  >
                    {data?.database?.host || "localhost"}
                  </div>
                </div>

                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-md">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-medium mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Latency & Speed</span>
                  </div>
                  <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                    <span className="font-mono">{data?.latencyMs ?? 0} ms</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        (data?.latencyMs || 0) < 300
                          ? "bg-emerald-100 text-emerald-700"
                          : (data?.latencyMs || 0) < 1000
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {(data?.latencyMs || 0) < 300
                        ? "Optimal"
                        : (data?.latencyMs || 0) < 1000
                        ? "Normal"
                        : "Slow"}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-500">Round-trip query ping</div>
                </div>
              </div>

              {/* Individual Tables Storage Breakdown */}
              {storage && storage.tables && storage.tables.length > 0 && (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-neutral-600" />
                      Table Storage Details ({storage.tables.length} Models)
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">
                      Data: {storage.tablesTotalFormatted}
                    </span>
                  </div>

                  <div className="border border-neutral-200 rounded bg-white overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase tracking-wider text-[10px] border-b border-neutral-200 sticky top-0">
                        <tr>
                          <th className="py-1.5 px-2.5">Table</th>
                          <th className="py-1.5 px-2 text-right">Rows</th>
                          <th className="py-1.5 px-2 text-right">Data</th>
                          <th className="py-1.5 px-2 text-right">Index</th>
                          <th className="py-1.5 px-2.5 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {storage.tables.map((t) => (
                          <tr key={t.tableName} className="hover:bg-neutral-50/70 font-mono">
                            <td className="py-1.5 px-2.5 font-sans font-semibold text-neutral-800">
                              {t.tableName}
                            </td>
                            <td className="py-1.5 px-2 text-right text-neutral-600">
                              {t.rowCount}
                            </td>
                            <td className="py-1.5 px-2 text-right text-neutral-500">
                              {t.tableFormatted}
                            </td>
                            <td className="py-1.5 px-2 text-right text-neutral-500">
                              {t.indexFormatted}
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-bold text-neutral-900">
                              {t.totalFormatted}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Version & Checked At info */}
              <div className="text-[11px] text-neutral-500 space-y-1 pt-1 border-t border-neutral-100">
                <div className="flex justify-between">
                  <span>Server Version:</span>
                  <span className="font-mono text-neutral-700 truncate max-w-[280px]" title={data?.database?.version}>
                    {data?.database?.version ? data.database.version.split(" ")[0] + " " + (data.database.version.split(" ")[1] || "") : "PostgreSQL 18.x"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Verified:</span>
                  <span className="font-mono text-neutral-700">
                    {data?.checkedAt ? new Date(data.checkedAt).toLocaleTimeString() : "Never"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-neutral-400">
                Auto-pings every 60 seconds
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchStatus}
                  disabled={refreshing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#B80000] text-white hover:bg-[#950000] disabled:opacity-60 transition-colors shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  <span>{refreshing ? "Testing..." : "Test Connection Now"}</span>
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
