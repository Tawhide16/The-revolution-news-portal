import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, saveDb, logAudit } from "@/lib/store";
import { can } from "@/lib/rbac";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (!can({ role: userRole, id: userId }, "tag:manage")) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    const db = getDb();
    const tag = db.tags.find((t) => t.id === params.id);
    if (!tag) {
      return NextResponse.json({ success: false, error: "Tag not found" }, { status: 404 });
    }

    db.tags = db.tags.filter((t) => t.id !== params.id);
    saveDb(db);

    logAudit("DELETE", "Tag", params.id, userId, userName, `Deleted tag "${tag.name}"`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete tag" }, { status: 500 });
  }
}
