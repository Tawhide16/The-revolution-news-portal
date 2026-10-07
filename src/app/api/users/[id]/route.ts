import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, saveDb, logAudit } from "@/lib/store";
import { can, Role } from "@/lib/rbac";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (!can({ role: userRole, id: userId }, "users:manage")) {
      return NextResponse.json({ success: false, error: "Only ADMIN can modify users" }, { status: 403 });
    }

    const db = getDb();
    const index = db.users.findIndex((u) => u.id === params.id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const current = db.users[index];

    // Prevent deactivating own account
    if (current.id === userId && body.active === false) {
      return NextResponse.json(
        { success: false, error: "You cannot deactivate your own account" },
        { status: 400 }
      );
    }

    const updated = {
      ...current,
      name: body.name || current.name,
      role: (body.role as Role) || current.role,
      active: typeof body.active === "boolean" ? body.active : current.active,
    };

    db.users[index] = updated;
    saveDb(db);

    logAudit("UPDATE", "User", current.id, userId, userName, `Modified user "${updated.name}" (${updated.role}, Active: ${updated.active})`);

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
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

    if (!can({ role: userRole, id: userId }, "users:manage")) {
      return NextResponse.json({ success: false, error: "Only ADMIN can delete users" }, { status: 403 });
    }

    if (params.id === userId) {
      return NextResponse.json({ success: false, error: "Cannot delete your own account" }, { status: 400 });
    }

    const db = getDb();
    const user = db.users.find((u) => u.id === params.id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    db.users = db.users.filter((u) => u.id !== params.id);
    saveDb(db);

    logAudit("DELETE", "User", params.id, userId, userName, `Deleted user "${user.name}"`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 });
  }
}
