import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";
    // Ignore common bots
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);
    if (isBot) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const body = await req.json();
    const articleId = body.articleId || body.id;
    if (!articleId) {
      return NextResponse.json({ success: false, error: "Missing articleId" }, { status: 400 });
    }

    const db = getDb();
    const article = db.articles.find((a) => a.id === articleId || a.slug === articleId);
    if (article) {
      article.views = (article.views || 0) + 1;
      saveDb(db);
      return NextResponse.json({ success: true, views: article.views });
    }

    return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to increment views" }, { status: 500 });
  }
}
