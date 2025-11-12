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

export const createStaffSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Staff name must be at least 2 characters long" }),
  contactNumber: z
    .string()
    .min(10, { message: "Contact number must be at least 10 characters long" }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters long" })
    .optional(),
  role: z.enum([
    "head_of_operation",
    "stylist",
    "manicurist",
    "make_up_artist",
    "floor_manager",
    "spa_staff",
    "cleaning_staff",
  ]),
  branchId: z.string(),
});

export const updateStaffSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .optional(),
  contactNumber: z
    .string()
    .min(10, { message: "Contact number must be at least 10 characters long" })
    .optional(),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters long" })
    .optional(),
  role: z
    .enum([
      "head_of_operation",
      "stylist",
      "manicurist",
      "make_up_artist",
      "floor_manager",
      "spa_staff",
      "cleaning_staff",
    ])
    .optional(),
  branchId: z.string(),
});

export const createServiceSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long" })
    .max(200, { message: "Description must be at most 200 characters long" })
    .optional(),
  price: z.string().min(0, { message: "Price must be at least 0" }),
  durationMinutes: z
    .string()
    .min(0, { message: "Duration must be at least 0" })
    .optional(),
  branchId: z.string(),
});

export const updateServiceSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .optional(),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long" })
    .optional(),
  price: z.float64().min(0, { message: "Price must be at least 0" }).optional(),
  durationMinutes: z
    .string()
    .min(0, { message: "Duration must be at least 0" })
    .optional(),
});

export const createProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().int().min(0).optional(),
  volume: z.string().min(1, "Volume is required"),
  price: z.string().min(1, "Price is required"),
  costPrice: z.string().min(1, "Cost price is required"),
  gst: z.string().min(1, "GST is required"),
  hsn: z.string().optional(),
  batchCode: z.string().optional(),
  manufacturer: z.string().optional(),
  expiry: z.string().optional(),
  shelfLifeInDays: z.string().min(1, "Shelf life is required"),
  triggerNotificationInDays: z
    .string()
    .min(1, "Notification trigger days is required"),
  noOfUses: z.string().min(1, "Number of uses is required"),
  status: z
    .enum(["available", "not_available", "discontinued", "draft"])
    .optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().min(1).optional(),
  volume: z.string().min(1).optional(),
  price: z.string().min(1).optional(),
  costPrice: z.string().min(1).optional(),
  gst: z.string().min(1).optional(),
  hsn: z.string().optional(),
  batchCode: z.string().optional(),
  manufacturer: z.string().optional(),
  expiry: z.string().optional(),
  shelfLifeInDays: z.string().optional(),
  triggerNotificationInDays: z.string().optional(),
  noOfUses: z.string().optional(),
});

export const updateProductStatusSchema = z.object({
  status: z.enum(["available", "not_available", "discontinued", "draft"]),
});

export const createStockUpdateSchema = z.object({
  dateOfPurchase: z.string().min(1, "Date of purchase is required"),
  volume: z.string().min(1, "Volume is required"),
  quantity: z.string().min(1, "Quantity is required"),
  costPrice: z.string().min(1, "Cost price is required"),
});

export const updateStockUpdateSchema = z.object({
  dateOfPurchase: z.string().optional(),
  volume: z.string().optional(),
  quantity: z.string().optional(),
  costPrice: z.string().optional(),
});

export const createReviewSchema = z.object({
  rating: z.number().min(1, "Rating is required"),
  comments: z.string().optional(),
  customerId: z.string().min(1, "Customer ID is required"),
  bookingId: z.string().min(1, "Booking ID is required"),
});

export const createSlotSchema = z.object({
  slotStart: z.string().min(1, "Slot start is required"),
  slotEnd: z.string().min(1, "Slot end is required"),
  branchId: z.string().min(1, "Branch ID is required"),
  staffId: z.string().min(1, "Staff ID is required").optional(),
});

export const updateSlotSchema = z.object({
  slotStart: z.string().optional(),
  slotEnd: z.string().optional(),
  branchId: z.string().min(1, "Branch ID is required"),
  staffId: z.string().min(1, "Staff ID is required").optional(),
});

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile: z.string().min(1, "Contact number is required"),
  place: z.string().min(1, "Place is required").optional(),
  email: z.string().email("Invalid email address").optional(),
});

export const createBookingSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  serviceId: z.string().min(1, "Service ID is required"),
  slotId: z.string().min(1, "Slot ID is required"),
  status: z.enum(["upcoming", "ongoing", "done"]),
});
