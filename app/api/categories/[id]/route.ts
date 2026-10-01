import { NextRequest } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/mongodb";
import { getCurrentAdmin } from "@/lib/auth/get-current-admin";
import { success, failure } from "@/lib/responses";
import { slugify } from "@/lib/slugify";
import Category from "@/models/Category";
import Article from "@/models/Article";
import { categorySchema } from "@/validators/category";
import { isDuplicateKeyError } from "@/lib/is-duplicate-key-error";

type CategoryRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: CategoryRouteContext
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return failure("Invalid category ID", 400);
    }

    await connectDB();

    const category = await Category.findById(id);

    if (!category) {
      return failure("Category not found", 404);
    }

    return success("Category fetched successfully", category);
  } catch (error) {
    console.error("Get category error:", error);

    return failure("Failed to fetch category", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: CategoryRouteContext
) {
  try {
    const admin = getCurrentAdmin(request);

    if (!admin) {
      return failure("Unauthorized", 401);
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return failure("Invalid category ID", 400);
    }

    await connectDB();

    const body = await request.json();

    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return failure("Validation failed", 400, result.error.flatten());
    }

    const { name, description } = result.data;

    const category = await Category.findById(id);

    if (!category) {
      return failure("Category not found", 404);
    }

    const slug = slugify(name);

    const existingCategory = await Category.findOne({
      _id: { $ne: id },
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return failure("Another category with this name already exists", 409);
    }

    category.name = name;
    category.slug = slug;
    category.description = description;

    await category.save();

    return success("Category updated successfully", category);
  } catch (error) {
    console.error("Update category error:", error);

    if (isDuplicateKeyError(error)) {
      return failure("Category already exists", 409);
    }

    return failure("Failed to update category", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: CategoryRouteContext
) {
  try {
    const admin = getCurrentAdmin(request);

    if (!admin) {
      return failure("Unauthorized", 401);
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return failure("Invalid category ID", 400);
    }

    await connectDB();

    const category = await Category.findById(id);

    if (!category) {
      return failure("Category not found", 404);
    }

    const articleCount = await Article.countDocuments({
      category: id,
    });

    if (articleCount > 0) {
      return failure(
        "Cannot delete a category that is being used by articles",
        409,
        {
          articleCount,
        }
      );
    }

    await Category.findByIdAndDelete(id);

    return success("Category deleted successfully");
  } catch (error) {
    console.error("Delete category error:", error);

    return failure("Failed to delete category", 500);
  }
}
