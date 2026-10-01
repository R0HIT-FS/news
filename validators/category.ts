import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name cannot exceed 50 characters"),

  description: z
    .string()
    .trim()
    .max(200, "Description cannot exceed 200 characters")
    .optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;