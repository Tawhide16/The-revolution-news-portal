import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, saveDb, logAudit, StoredTag } from "@/lib/store";
import { tagSchema } from "@/lib/validators";
import { createSlug } from "@/lib/slug";
import { can } from "@/lib/rbac";

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({ success: true, tags: db.tags });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (!can({ role: userRole, id: userId }, "tag:manage")) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.slug && body.name) {
      body.slug = createSlug(body.name);
    }

    const parsed = tagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, slug } = parsed.data;
    const db = getDb();

    if (db.tags.some((t) => t.slug === slug || t.name.toLowerCase() === name.toLowerCase())) {
      return NextResponse.json({ success: false, error: "Tag already exists" }, { status: 400 });
    }

    const newTag: StoredTag = {
      id: `tag-${Date.now()}`,
      name,
      slug,
    };

    db.tags.push(newTag);
    saveDb(db);

    logAudit("CREATE", "Tag", newTag.id, userId, userName, `Created tag "${name}"`);

    return NextResponse.json({ success: true, tag: newTag }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create tag" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (!can({ role: userRole, id: userId }, "tag:manage")) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing tag ID" }, { status: 400 });
    }

    const db = getDb();
    const tag = db.tags.find((t) => t.id === id);
    if (!tag) {
      return NextResponse.json({ success: false, error: "Tag not found" }, { status: 404 });
    }

    db.tags = db.tags.filter((t) => t.id !== id);
    saveDb(db);

    logAudit("DELETE", "Tag", id, userId, userName, `Deleted tag "${tag.name}"`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete tag" }, { status: 500 });
  }
}
