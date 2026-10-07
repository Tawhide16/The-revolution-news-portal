import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, saveDb, logAudit } from "@/lib/store";
import { categorySchema } from "@/lib/validators";
import { createSlug } from "@/lib/slug";
import { can } from "@/lib/rbac";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (!can({ role: userRole, id: userId }, "category:manage")) {
      return NextResponse.json(
        { success: false, error: "Only Admin and Editor can edit categories" },
        { status: 403 }
      );
    }

    const db = getDb();
    const index = db.categories.findIndex((c) => c.id === params.id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    if (!body.slug && body.name) {
      body.slug = createSlug(body.name);
    }

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, slug, description, order } = parsed.data;

    // Check collision
    const collision = db.categories.find(
      (c) => (c.slug === slug || c.name.toLowerCase() === name.toLowerCase()) && c.id !== params.id
    );
    if (collision) {
      return NextResponse.json(
        { success: false, error: "Another category uses this name or slug" },
        { status: 400 }
      );
    }

    const updated = {
      ...db.categories[index],
      name,
      slug,
      description: description || "",
      order: order ?? db.categories[index].order,
    };

    db.categories[index] = updated;

    // Also update categoryName & categorySlug in associated articles
    db.articles.forEach((a) => {
      if (a.categoryId === params.id) {
        a.categoryName = name;
        a.categorySlug = slug;
      }
    });

    saveDb(db);

    logAudit("UPDATE", "Category", params.id, userId, userName, `Updated category "${name}"`);

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
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

    if (!can({ role: userRole, id: userId }, "category:manage")) {
      return NextResponse.json(
        { success: false, error: "Only Admin and Editor can delete categories" },
        { status: 403 }
      );
    }

    const db = getDb();
    const category = db.categories.find((c) => c.id === params.id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // SPEC REQUIREMENT: block delete if articles exist!
    const articlesCount = db.articles.filter((a) => a.categoryId === params.id).length;
    if (articlesCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category "${category.name}" because ${articlesCount} article(s) are assigned to it. Reassign or delete those articles first.`,
        },
        { status: 400 }
      );
    }

    db.categories = db.categories.filter((c) => c.id !== params.id);
    saveDb(db);

    logAudit("DELETE", "Category", params.id, userId, userName, `Deleted category "${category.name}"`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
