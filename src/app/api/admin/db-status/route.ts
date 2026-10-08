import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDb } from "@/lib/store";

export const dynamic = "force-dynamic";

function sanitizeHost(urlStr?: string): { host: string; dbName: string; ssl: boolean } {
  if (!urlStr) return { host: "Not Configured", dbName: "N/A", ssl: false };
  try {
    const url = new URL(urlStr);
    return {
      host: url.hostname || "localhost",
      dbName: url.pathname.replace(/^\//, "") || "postgres",
      ssl: url.searchParams.get("sslmode") === "require" || url.searchParams.get("ssl") === "true",
    };
  } catch {
    return { host: "Custom URL", dbName: "Unknown", ssl: false };
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

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

export async function GET() {
  const startTime = Date.now();
  let dbConnected = false;
  let latencyMs = 0;
  let serverVersion = "";
  let serverTime = "";
  let dbError: string | null = null;
  let counts = { users: 0, articles: 0, categories: 0, tags: 0, auditLogs: 0 };

  const TOTAL_QUOTA_BYTES = 1024 * 1024 * 1024; // 1 GB (1,073,741,824 bytes)

  let storageInfo: StorageMetrics = {
    quotaBytes: TOTAL_QUOTA_BYTES,
    quotaFormatted: "1.00 GB",
    usedBytes: 0,
    usedFormatted: "0 B",
    remainingBytes: TOTAL_QUOTA_BYTES,
    remainingFormatted: "1.00 GB",
    percentUsed: 0,
    tablesTotalBytes: 0,
    tablesTotalFormatted: "0 B",
    systemOverheadBytes: 0,
    systemOverheadFormatted: "0 B",
    tables: [],
  };

  const dbUrl = process.env.DATABASE_URL;
  const sanitized = sanitizeHost(dbUrl);

  try {
    const pingPromise = Promise.all([
      prisma.$queryRawUnsafe<Array<{ ping: number; server_time: Date; version: string }>>(
        "SELECT 1 as ping, NOW() as server_time, version() as version"
      ),
      prisma.user.count().catch(() => 0),
      prisma.article.count().catch(() => 0),
      prisma.category.count().catch(() => 0),
      prisma.tag.count().catch(() => 0),
      prisma.auditLog.count().catch(() => 0),
      // Query database total size
      prisma.$queryRawUnsafe<Array<{ total_bytes: string }>>(
        "SELECT pg_database_size(current_database())::text as total_bytes"
      ).catch(() => []),
      // Query per-table size and row counts
      prisma.$queryRawUnsafe<Array<{
        table_name: string;
        total_bytes: string;
        table_bytes: string;
        index_bytes: string;
        row_count: string;
      }>>(`
        SELECT 
          c.relname AS table_name,
          pg_total_relation_size(c.oid)::text AS total_bytes,
          pg_relation_size(c.oid)::text AS table_bytes,
          pg_indexes_size(c.oid)::text AS index_bytes,
          COALESCE(s.n_live_tup, 0)::text AS row_count
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        LEFT JOIN pg_stat_user_tables s ON s.relid = c.oid
        WHERE n.nspname = 'public' AND c.relkind = 'r'
        ORDER BY pg_total_relation_size(c.oid) DESC
      `).catch(() => []),
    ]);

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Database connection timed out (8000ms)")), 8000)
    );

    const [
      pingResult,
      userCount,
      articleCount,
      categoryCount,
      tagCount,
      auditCount,
      dbSizeResult,
      tableSizeResult,
    ] = await Promise.race([pingPromise, timeoutPromise]);

    latencyMs = Date.now() - startTime;
    dbConnected = true;

    if (pingResult && pingResult[0]) {
      serverVersion = pingResult[0].version || "PostgreSQL";
      serverTime = pingResult[0].server_time ? new Date(pingResult[0].server_time).toISOString() : new Date().toISOString();
    }

    counts = {
      users: userCount,
      articles: articleCount,
      categories: categoryCount,
      tags: tagCount,
      auditLogs: auditCount,
    };

    // Parse storage metrics
    const totalDbBytes = dbSizeResult?.[0]?.total_bytes ? Number(dbSizeResult[0].total_bytes) : 0;
    let sumTablesBytes = 0;

    const parsedTables: TableStorageInfo[] = (tableSizeResult || []).map((t) => {
      const tBytes = Number(t.total_bytes || 0);
      const dataBytes = Number(t.table_bytes || 0);
      const idxBytes = Number(t.index_bytes || 0);
      const rows = Number(t.row_count || 0);
      sumTablesBytes += tBytes;

      return {
        tableName: t.table_name,
        totalBytes: tBytes,
        tableBytes: dataBytes,
        indexBytes: idxBytes,
        totalFormatted: formatBytes(tBytes),
        tableFormatted: formatBytes(dataBytes),
        indexFormatted: formatBytes(idxBytes),
        rowCount: rows,
        percentOfUsed: totalDbBytes > 0 ? Number(((tBytes / totalDbBytes) * 100).toFixed(2)) : 0,
      };
    });

    const overheadBytes = Math.max(0, totalDbBytes - sumTablesBytes);
    const remainingBytes = Math.max(0, TOTAL_QUOTA_BYTES - totalDbBytes);
    const percentUsed = Number(((totalDbBytes / TOTAL_QUOTA_BYTES) * 100).toFixed(2));

    storageInfo = {
      quotaBytes: TOTAL_QUOTA_BYTES,
      quotaFormatted: "1.00 GB",
      usedBytes: totalDbBytes,
      usedFormatted: formatBytes(totalDbBytes),
      remainingBytes,
      remainingFormatted: formatBytes(remainingBytes),
      percentUsed,
      tablesTotalBytes: sumTablesBytes,
      tablesTotalFormatted: formatBytes(sumTablesBytes),
      systemOverheadBytes: overheadBytes,
      systemOverheadFormatted: formatBytes(overheadBytes),
      tables: parsedTables,
    };
  } catch (err: unknown) {
    latencyMs = Date.now() - startTime;
    dbConnected = false;
    dbError = err instanceof Error ? err.message : "Failed to reach PostgreSQL database";
  }

  // Check Local JSON store status as well
  let localStoreStatus = "unknown";
  let localStats = { articles: 0, categories: 0, users: 0 };
  try {
    const localDb = getDb();
    localStoreStatus = "healthy";
    localStats = {
      articles: localDb.articles.length,
      categories: localDb.categories.length,
      users: localDb.users.length,
    };
  } catch {
    localStoreStatus = "error";
  }

  return NextResponse.json({
    success: true,
    status: dbConnected ? "connected" : "error",
    checkedAt: new Date().toISOString(),
    latencyMs,
    database: {
      connected: dbConnected,
      provider: sanitized.host.includes("neon.tech") ? "Neon Serverless PostgreSQL" : "PostgreSQL",
      host: sanitized.host,
      databaseName: sanitized.dbName,
      ssl: sanitized.ssl,
      version: serverVersion,
      serverTime,
      counts,
      error: dbError,
    },
    storage: storageInfo,
    localStorage: {
      status: localStoreStatus,
      counts: localStats,
    },
  });
}
