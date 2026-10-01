import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db/mongodb";
import { getCurrentAdmin } from "@/lib/auth/get-current-admin";
import { success, failure } from "@/lib/responses";
import { slugify } from "@/lib/slugify";
import Category from "@/models/Category";
import { categorySchema } from "@/validators/category";
import { isDuplicateKeyError } from "@/lib/is-duplicate-key-error";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().sort({ name: 1 }).lean();

    return success("Categories fetched successfully", categories);
  } catch (error) {
    console.error("Get categories error:", error);

    return failure("Failed to fetch categories", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = getCurrentAdmin(request);

    if (!admin) {
      return failure("Unauthorized", 401);
    }

    await connectDB();

    const body = await request.json();

    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return failure("Validation failed", 400, result.error.flatten());
    }

    const { name, description } = result.data;

    const slug = slugify(name);

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return failure("Category already exists", 409);
    }

    const category = await Category.create({
      name,
      slug,
      description,
    });

    return success("Category created successfully", category, 201);
  } catch (error) {
    console.error("Create category error:", error);

    if (isDuplicateKeyError(error)) {
      return failure("Category already exists", 409);
    }

    return failure("Failed to create category", 500);
  }
}
