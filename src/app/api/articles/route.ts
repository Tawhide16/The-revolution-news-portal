import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, saveDb, logAudit, StoredArticle } from "@/lib/store";
import { articleSchema } from "@/lib/validators";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { can } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const db = getDb();
    let articles = [...db.articles];

    if (search) {
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.summary.toLowerCase().includes(search)
      );
    }

    if (status && status !== "ALL") {
      articles = articles.filter((a) => a.status === status);
    }

    if (category && category !== "ALL") {
      articles = articles.filter(
        (a) => a.categoryId === category || a.categorySlug === category
      );
    }

    // Sort newest first
    articles.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = articles.length;
    const paginated = articles.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      articles: paginated,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (!can({ role: userRole, id: userId }, "article:create")) {
      return NextResponse.json(
        { success: false, error: "Permission denied to create articles" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = articleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      title,
      slug,
      summary,
      content,
      coverImage,
      categoryId,
      tags,
      status,
      featured,
      breaking,
    } = parsed.data;

    // Enforce workflow rules: Author cannot publish, moves to REVIEW
    let finalStatus = status;
    if (userRole === "AUTHOR" && (status === "PUBLISHED" || status === "SCHEDULED")) {
      finalStatus = "REVIEW";
    }

    const db = getDb();

    // Check duplicate slug
    const existing = db.articles.find((a) => a.slug === slug);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An article with this slug already exists" },
        { status: 400 }
      );
    }

    const category = db.categories.find((c) => c.id === categoryId);
    const categoryName = category ? category.name : "General";
    const categorySlug = category ? category.slug : "general";

    const newArticle: StoredArticle = {
      id: `art-${Date.now()}`,
      title,
      slug,
      summary,
      content: sanitizeArticleHtml(content),
      coverImage: coverImage || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
      categoryId,
      categoryName,
      categorySlug,
      authorId: userId,
      authorName: userName,
      status: finalStatus,
      featured: userRole === "AUTHOR" ? false : featured,
      breaking: userRole === "AUTHOR" ? false : breaking,
      views: 0,
      publishedAt: finalStatus === "PUBLISHED" ? new Date().toISOString() : "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags || [],
    };

    db.articles.unshift(newArticle);
    saveDb(db);

    logAudit("CREATE", "Article", newArticle.id, userId, userName, `Created article "${title}" with status ${finalStatus}`);

    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (error) {
    console.error("POST /api/articles error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create article" },
      { status: 500 }
    );
  }
}
