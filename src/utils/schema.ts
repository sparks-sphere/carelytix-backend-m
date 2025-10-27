import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
  primaryContactNo: z.string().optional(),
  userMeta: z
    .object({
      salonName: z.string().optional(),
      salonSize: z.string().optional(),
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z.string(),
});

export const salonCreationSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Salon name must be at least 2 characters long" })
    .max(50, { message: "Salon name must be at most 50 characters long" }),
});

export const salonUpdationSchema = salonCreationSchema.partial();

export const createBranchSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Branch name must be at least 2 characters long" })
    .max(50, { message: "Branch name must be at most 50 characters long" }),
  branchCode: z.string(),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters long" })
    .max(200, { message: "Address must be at most 100 characters long" })
    .optional(),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters long" })
    .max(50, {
      message: "City must be at most 50 characters long",
    })
    .optional(),
  pincode: z
    .string()
    .min(6, { message: "Pincode must be at least 6 characters long" })
    .max(6, { message: "Pincode must be at most 6 characters long" })
    .optional(),
  contactNo: z
    .string()
    .min(10, { message: "Contact number must be at least 10 characters long" })
    .optional(),
  saloonId: z
    .string()
    .min(1, { message: "Salon ID is required" })
    .max(100, { message: "Salon ID must be at most 100 characters long" }),
});

export const updateBranchSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Branch name must be at least 2 characters long" })
    .max(50, { message: "Branch name must be at most 50 characters long" })
    .optional(),
  branchCode: z.string().optional(),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters long" })
    .max(200, { message: "Address must be at most 100 characters long" })
    .optional(),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters long" })
    .max(50, {
      message: "City must be at most 50 characters long",
    })
    .optional(),
  pincode: z
    .string()
    .min(6, { message: "Pincode must be at least 6 characters long" })
    .max(6, { message: "Pincode must be at most 6 characters long" })
    .optional(),
  contactNo: z
    .string()
    .min(10, { message: "Contact number must be at least 10 characters long" })
    .optional(),
});

export const deleteBranchSchema = z.object({
  saloonId: z
    .string()
    .min(1, { message: "Salon ID is required" })
    .max(100, { message: "Salon ID must be at most 100 characters long" }),
});
