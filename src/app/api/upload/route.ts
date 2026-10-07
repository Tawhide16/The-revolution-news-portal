import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, saveDb, logAudit, StoredMedia } from "@/lib/store";
import fs from "fs";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({ success: true, media: db.media });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load media" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("alt") as string) || "";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPEG, PNG and WEBP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File exceeds 5 MB size limit." },
        { status: 400 }
      );
    }

    const uploadDir = path.resolve(process.env.UPLOAD_DIR || "./uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const safeFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadDir, safeFilename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;
    const db = getDb();

    const newMedia: StoredMedia = {
      id: `m-${Date.now()}`,
      url: publicUrl,
      name: file.name,
      alt: altText || file.name,
      sizeBytes: file.size,
      createdAt: new Date().toISOString(),
      uploadedBy: userName,
    };

    db.media.unshift(newMedia);
    saveDb(db);

    logAudit("CREATE", "Media", newMedia.id, userId, userName, `Uploaded file "${file.name}"`);

    return NextResponse.json({ success: true, media: newMedia, url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "File upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing media ID" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "ADMIN";
    const userId = session?.user?.id || "u-1";
    const userName = session?.user?.name || "Admin Chief";

    if (userRole === "AUTHOR") {
      return NextResponse.json({ success: false, error: "Authors cannot delete media" }, { status: 403 });
    }

    const db = getDb();
    const item = db.media.find((m) => m.id === id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 });
    }

    // Try deleting physical file if local
    if (item.url.startsWith("/uploads/")) {
      const uploadDir = path.resolve(process.env.UPLOAD_DIR || "./uploads");
      const filename = item.url.replace("/uploads/", "");
      const physicalPath = path.join(uploadDir, filename);
      if (fs.existsSync(physicalPath)) {
        fs.unlinkSync(physicalPath);
      }
    }

    db.media = db.media.filter((m) => m.id !== id);
    saveDb(db);

    logAudit("DELETE", "Media", id, userId, userName, `Deleted media "${item.name}"`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete media" }, { status: 500 });
  }
}
