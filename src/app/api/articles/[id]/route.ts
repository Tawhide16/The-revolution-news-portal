import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, saveDb, logAudit } from "@/lib/store";
import { articleSchema } from "@/lib/validators";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { can } from "@/lib/rbac";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const article = db.articles.find(
      (a) => a.id === params.id || a.slug === params.id
    );

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, article });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    const db = getDb();
    const index = db.articles.findIndex((a) => a.id === params.id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    const current = db.articles[index];

    // Check RBAC
    const canEdit = can(
      { role: userRole, id: userId },
      "article:edit",
      { authorId: current.authorId, status: current.status }
    );

    if (!canEdit) {
      return NextResponse.json(
        { success: false, error: "Permission denied to edit this article" },
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

    // Check slug collision
    const slugCollision = db.articles.find(
      (a) => a.slug === slug && a.id !== params.id
    );
    if (slugCollision) {
      return NextResponse.json(
        { success: false, error: "Another article already uses this slug" },
        { status: 400 }
      );
    }

    // Role restrictions for publishing
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

    logAudit(
      "UPDATE",
      "Article",
      updated.id,
      userId,
      userName,
      `Updated article "${title}" (Status: ${finalStatus})`
    );

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    console.error("PUT /api/articles/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    const db = getDb();
    const article = db.articles.find((a) => a.id === params.id);
    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    const canDelete = can(
      { role: userRole, id: userId },
      "article:delete",
      { authorId: article.authorId, status: article.status }
    );

    if (!canDelete) {
      return NextResponse.json(
        {
          success: false,
          error:
            userRole === "AUTHOR"
              ? "Authors can only delete their own draft articles."
              : "Permission denied.",
        },
        { status: 403 }
      );
    }

    db.articles = db.articles.filter((a) => a.id !== params.id);
    saveDb(db);

    logAudit(
      "DELETE",
      "Article",
      params.id,
      userId,
      userName,
      `Deleted article "${article.title}"`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/articles/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
