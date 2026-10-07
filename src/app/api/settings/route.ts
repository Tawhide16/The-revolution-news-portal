import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, saveDb, logAudit } from "@/lib/store";
import { settingsSchema } from "@/lib/validators";
import { can } from "@/lib/rbac";

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({ success: true, settings: db.settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (!can({ role: userRole, id: userId }, "settings:manage")) {
      return NextResponse.json(
        { success: false, error: "Only ADMIN can manage site settings" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const db = getDb();
    db.settings = {
      ...db.settings,
      ...parsed.data,
    };
    saveDb(db);

    logAudit("UPDATE", "Settings", "settings", userId, userName, "Updated global site settings");

    return NextResponse.json({ success: true, settings: db.settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
