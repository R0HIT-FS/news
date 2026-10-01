"use client";

import { FormEvent, useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

type CategoryForm = {
  name: string;
  description: string;
};

const initialForm: CategoryForm = {
  name: "",
  description: "",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryForm>(initialForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function fetchCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/categories");

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch categories"
        );
      }

      setCategories(result.data || []);
    } catch (error) {
      console.error("Fetch categories error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function handleInputChange(
    field: keyof CategoryForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function startEditing(category: Category) {
    setEditingId(category._id);

    setForm({
      name: category.name,
      description: category.description || "",
    });

    setError("");
    setSuccessMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");
    setSubmitting(true);

    try {
      const isEditing = Boolean(editingId);

      const url = isEditing
        ? `/api/categories/${editingId}`
        : "/api/categories";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Something went wrong"
        );
      }

      setSuccessMessage(
        isEditing
          ? "Category updated successfully."
          : "Category created successfully."
      );

      resetForm();

      await fetchCategories();
    } catch (error) {
      console.error("Category submit error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setDeletingId(category._id);

    try {
      const response = await fetch(
        `/api/categories/${category._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete category"
        );
      }

      setSuccessMessage(
        "Category deleted successfully."
      );

      if (editingId === category._id) {
        resetForm();
      }

      await fetchCategories();
    } catch (error) {
      console.error("Delete category error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete category"
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Categories
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Create and manage news categories.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-medium">
            {editingId
              ? "Edit Category"
              : "Create Category"}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {editingId
              ? "Update the category information."
              : "Add a new category for your news articles."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(event) =>
                handleInputChange(
                  "name",
                  event.target.value
                )
              }
              placeholder="Technology"
              disabled={submitting}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                handleInputChange(
                  "description",
                  event.target.value
                )
              }
              placeholder="News and updates about technology."
              rows={3}
              disabled={submitting}
              className="w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update Category"
                  : "Create Category"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="rounded-md border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-medium">
            All Categories
          </h2>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-zinc-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-zinc-500">
            No categories found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-zinc-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">
                    Name
                  </th>

                  <th className="px-6 py-3 text-left font-medium">
                    Slug
                  </th>

                  <th className="px-6 py-3 text-left font-medium">
                    Description
                  </th>

                  <th className="px-6 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-6 py-4 font-medium">
                      {category.name}
                    </td>

                    <td className="px-6 py-4 text-zinc-500">
                      {category.slug}
                    </td>

                    <td className="px-6 py-4 text-zinc-500">
                      {category.description || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(category)
                          }
                          disabled={
                            submitting ||
                            deletingId === category._id
                          }
                          className="rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(category)
                          }
                          disabled={
                            deletingId === category._id
                          }
                          className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === category._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}