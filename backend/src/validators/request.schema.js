import { z } from "zod";
import { CATEGORIES, STATUSES } from "../constants.js";

const base = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000),
  category: z.enum(CATEGORIES, { message: "Invalid category" }),
  budget: z
    .number({ message: "Budget must be a number" })
    .min(0, "Budget cannot be negative"),
});

export const createRequestSchema = base;

export const updateRequestSchema = base
  .partial()
  .extend({
    status: z.enum(STATUSES, { message: "Invalid status" }).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide at least one field to update",
  });

export const listQuerySchema = z.object({
  status: z.enum(STATUSES).optional(),
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
