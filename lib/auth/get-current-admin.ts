import { NextRequest } from "next/server";

import { verifyToken } from "@/lib/auth/jwt";

export function getCurrentAdmin(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  if (payload.role !== "admin") {
    return null;
  }

  return payload;
}