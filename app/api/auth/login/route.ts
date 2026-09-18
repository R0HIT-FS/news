import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import { generateToken } from "@/lib/auth/jwt";
import { loginSchema } from "@/validators/auth";
import { failure, success } from "@/lib/responses";

export async function POST(request: NextRequest) {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Read request body
    const body = await request.json();

    // 3. Validate request
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return failure(
        "Invalid login details.",
        400,
        result.error.flatten()
      );
    }

    // 4. Get validated data
    const { email, password } = result.data;

    // 5. Find the user
    const user = await User.findOne({ email });

    if (!user) {
      return failure(
        "Invalid email or password.",
        401
      );
    }

    // 6. Compare password
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return failure(
        "Invalid email or password.",
        401
      );
    }

    // 7. Generate JWT
    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    // 8. Create response
    const response = success(
      "Login successful."
    );

    // 9. Set authentication cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return failure(
      "Something went wrong while logging in.",
      500
    );
  }
}