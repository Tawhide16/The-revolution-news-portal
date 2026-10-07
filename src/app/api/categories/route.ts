import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, saveDb, logAudit, StoredCategory } from "@/lib/store";
import { categorySchema } from "@/lib/validators";
import { createSlug } from "@/lib/slug";
import { can } from "@/lib/rbac";

export async function GET() {
  try {
    const db = getDb();
    const sorted = [...db.categories].sort((a, b) => a.order - b.order);
    return NextResponse.json({ success: true, categories: sorted });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (!can({ role: userRole, id: userId }, "category:manage")) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.slug && body.name) {
      body.slug = createSlug(body.name);
    }

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, slug, description, order } = parsed.data;
    const db = getDb();

    if (db.categories.some((c) => c.slug === slug || c.name.toLowerCase() === name.toLowerCase())) {
      return NextResponse.json({ success: false, error: "Category already exists" }, { status: 400 });
    }

    const newCategory: StoredCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description: description || "",
      order: order ?? db.categories.length + 1,
    };

    db.categories.push(newCategory);
    saveDb(db);

    logAudit("CREATE", "Category", newCategory.id, userId, userName, `Created category "${name}"`);

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (!can({ role: userRole, id: userId }, "category:manage")) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    const body = await req.json();
    const id = body.id || new URL(req.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing category ID" }, { status: 400 });
    }

    const db = getDb();
    const index = db.categories.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    if (!body.slug && body.name) {
      body.slug = createSlug(body.name);
    }

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, slug, description, order } = parsed.data;

    const collision = db.categories.find(
      (c) => (c.slug === slug || c.name.toLowerCase() === name.toLowerCase()) && c.id !== id
    );
    if (collision) {
      return NextResponse.json({ success: false, error: "Another category uses this name or slug" }, { status: 400 });
    }

    const updated = {
      ...db.categories[index],
      name,
      slug,
      description: description || "",
      order: order ?? db.categories[index].order,
    };

    db.categories[index] = updated;

    db.articles.forEach((a) => {
      if (a.categoryId === id) {
        a.categoryName = name;
        a.categorySlug = slug;
      }
    });

    saveDb(db);

    logAudit("UPDATE", "Category", id, userId, userName, `Updated category "${name}"`);

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (!can({ role: userRole, id: userId }, "category:manage")) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing category ID" }, { status: 400 });
    }

    const db = getDb();
    const category = db.categories.find((c) => c.id === id);
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    const articlesCount = db.articles.filter((a) => a.categoryId === id).length;
    if (articlesCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category "${category.name}" because ${articlesCount} article(s) are assigned to it.`,
        },
        { status: 400 }
      );
    }

    db.categories = db.categories.filter((c) => c.id !== id);
    saveDb(db);

    logAudit("DELETE", "Category", id, userId, userName, `Deleted category "${category.name}"`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}
