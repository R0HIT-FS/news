import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth/jwt";
import { failure, success } from "@/lib/responses";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return failure("Not authenticated.", 401);
    }

    const payload = verifyToken(token);

    if (!payload) {
      return failure("Invalid or expired session.", 401);
    }

    await connectDB();

    const user = await User.findById(payload.id).select(
      "-password"
    );

    if (!user) {
      return failure("User not found.", 404);
    }

    return success("Authenticated user.", {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Auth me error:", error);

    return failure(
      "Something went wrong.",
      500
    );
  }
}