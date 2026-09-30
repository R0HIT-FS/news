import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth/jwt";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  // Public route
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Admin login page
  if (isLoginRoute) {
    if (token) {
      const payload = verifyToken(token);

      if (payload?.role === "admin") {
        return NextResponse.redirect(
          new URL("/admin", request.url)
        );
      }
    }

    return NextResponse.next();
  }

  // Protected admin route with no token
  if (!token) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  // Verify JWT
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  // Verify role
  if (payload.role !== "admin") {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  // Authenticated admin
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};