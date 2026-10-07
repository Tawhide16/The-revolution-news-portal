import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").toLowerCase().trim();

    if (!query) {
      return NextResponse.json({ success: true, results: [] });
    }

    const db = getDb();
    const results = db.articles.filter(
      (a) =>
        a.status === "PUBLISHED" &&
        (a.title.toLowerCase().includes(query) ||
          a.summary.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query) ||
          a.tags?.some((t) => t.toLowerCase().includes(query)))
    );

    return NextResponse.json({ success: true, results, count: results.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 });
  }
}
