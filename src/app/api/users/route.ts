import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, saveDb, logAudit, StoredUser } from "@/lib/store";
import { userSchema } from "@/lib/validators";
import { can } from "@/lib/rbac";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";

    if (!can({ role: userRole, id: userId }, "users:manage")) {
      return NextResponse.json({ success: false, error: "Only ADMIN can view and manage users" }, { status: 403 });
    }

    const db = getDb();
    return NextResponse.json({ success: true, users: db.users });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (!can({ role: userRole, id: userId }, "users:manage")) {
      return NextResponse.json({ success: false, error: "Only ADMIN can create users" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = userSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, role, active } = parsed.data;
    const db = getDb();

    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 400 });
    }

    const newUser: StoredUser = {
      id: `u-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role,
      active: active ?? true,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDb(db);

    logAudit("CREATE", "User", newUser.id, userId, userName, `Created user "${name}" (${role})`);

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 });
  }
}
