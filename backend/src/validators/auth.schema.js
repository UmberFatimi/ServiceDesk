import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email,
  password: z.string().min(6, "Password must be at least 6 characters"),
});
