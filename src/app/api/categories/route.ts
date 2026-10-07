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
    return NextResponse.json(
      { success: false, error: "Failed to load categories" },
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

    if (!can({ role: userRole, id: userId }, "category:manage")) {
      return NextResponse.json(
        { success: false, error: "Only Admin and Editor can manage categories" },
        { status: 403 }
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
    const db = getDb();

    if (db.categories.some((c) => c.slug === slug || c.name.toLowerCase() === name.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Category with this name or slug already exists" },
        { status: 400 }
      );
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
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
