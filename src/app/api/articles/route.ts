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
    const id = searchParams.get("id");

    const db = getDb();

    // Single article query
    if (id) {
      const article = db.articles.find((a) => a.id === id || a.slug === id);
      if (!article) {
        return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, article });
    }

    // List query with filters
    const search = searchParams.get("search")?.toLowerCase() || "";
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

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
    return NextResponse.json({ success: false, error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (!can({ role: userRole, id: userId }, "article:create")) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
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

    let finalStatus = status;
    if (userRole === "AUTHOR" && (status === "PUBLISHED" || status === "SCHEDULED")) {
      finalStatus = "REVIEW";
    }

    const db = getDb();
    if (db.articles.some((a) => a.slug === slug)) {
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 400 });
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

    logAudit("CREATE", "Article", newArticle.id, userId, userName, `Created article "${title}"`);

    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create article" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    const body = await req.json();
    const id = body.id || new URL(req.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing article ID" }, { status: 400 });
    }

    const db = getDb();
    const index = db.articles.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const current = db.articles[index];
    const canEdit = can({ role: userRole, id: userId }, "article:edit", {
      authorId: current.authorId,
      status: current.status,
    });

    if (!canEdit) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

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

    let finalStatus = status;
    if (userRole === "AUTHOR" && (status === "PUBLISHED" || status === "SCHEDULED")) {
      finalStatus = "REVIEW";
    }

    const category = db.categories.find((c) => c.id === categoryId);

    const updated = {
      ...current,
      title,
      slug,
      summary,
      content: sanitizeArticleHtml(content),
      coverImage: coverImage || current.coverImage,
      categoryId,
      categoryName: category ? category.name : current.categoryName,
      categorySlug: category ? category.slug : current.categorySlug,
      tags: tags || current.tags,
      status: finalStatus,
      featured: userRole === "AUTHOR" ? current.featured : featured,
      breaking: userRole === "AUTHOR" ? current.breaking : breaking,
      publishedAt:
        finalStatus === "PUBLISHED" && !current.publishedAt
          ? new Date().toISOString()
          : current.publishedAt,
      updatedAt: new Date().toISOString(),
    };

    db.articles[index] = updated;
    saveDb(db);

    logAudit("UPDATE", "Article", updated.id, userId, userName, `Updated article "${title}"`);

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing article ID" }, { status: 400 });
    }

    const db = getDb();
    const article = db.articles.find((a) => a.id === id);
    if (!article) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const canDelete = can({ role: userRole, id: userId }, "article:delete", {
      authorId: article.authorId,
      status: article.status,
    });

    if (!canDelete) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    db.articles = db.articles.filter((a) => a.id !== id);
    saveDb(db);

    logAudit("DELETE", "Article", id, userId, userName, `Deleted article "${article.title}"`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete article" }, { status: 500 });
  }
}
