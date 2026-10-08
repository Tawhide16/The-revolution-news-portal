import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Writer/Author cannot access /admin/users, /admin/settings, /admin/categories, /admin/tags, /admin/audit
    if (token?.role === "AUTHOR" || token?.role === "WRITER") {
      if (
        path.startsWith("/admin/users") ||
        path.startsWith("/admin/settings") ||
        path.startsWith("/admin/categories") ||
        path.startsWith("/admin/tags") ||
        path.startsWith("/admin/audit")
      ) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    // Editor cannot access /admin/users or /admin/settings or /admin/audit
    if (token?.role === "EDITOR") {
      if (
        path.startsWith("/admin/users") ||
        path.startsWith("/admin/settings") ||
        path.startsWith("/admin/audit")
      ) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin",
    "/admin/articles/:path*",
    "/admin/categories/:path*",
    "/admin/tags/:path*",
    "/admin/media/:path*",
    "/admin/users/:path*",
    "/admin/settings/:path*",
    "/admin/audit/:path*",
  ],
};
