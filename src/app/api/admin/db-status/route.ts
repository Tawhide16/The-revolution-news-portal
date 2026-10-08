import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

export async function GET() {
  const startTime = Date.now();
  let dbConnected = false;
  let latencyMs = 0;
  let serverVersion = "";
  let serverTime = "";
  let dbError: string | null = null;
  let counts = { users: 0, articles: 0, categories: 0, tags: 0, auditLogs: 0 };

  const dbUrl = process.env.DATABASE_URL;
  const sanitized = sanitizeHost(dbUrl);

  try {
    // Timeout promise to avoid hanging if network/database is slow
    const pingPromise = Promise.all([
      prisma.$queryRawUnsafe<Array<{ ping: number; server_time: Date; version: string }>>(
        "SELECT 1 as ping, NOW() as server_time, version() as version"
      ),
      prisma.user.count().catch(() => 0),
      prisma.article.count().catch(() => 0),
      prisma.category.count().catch(() => 0),
      prisma.tag.count().catch(() => 0),
      prisma.auditLog.count().catch(() => 0),
    ]);

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Database connection timed out (8000ms)")), 8000)
    );

    const [pingResult, userCount, articleCount, categoryCount, tagCount, auditCount] =
      await Promise.race([pingPromise, timeoutPromise]);

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
  } catch (err) {
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
    localStorage: {
      status: localStoreStatus,
      counts: localStats,
    },
  });
}
