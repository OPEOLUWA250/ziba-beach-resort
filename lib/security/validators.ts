import { z } from "zod";

const emailSchema = z.string().trim().email().max(254);
const phoneSchema = z
  .string()
  .trim()
  .regex(/^[+0-9()\-\s]{7,20}$/i, "Invalid phone format");
const personNameSchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-zA-Z\s'.-]+$/, "Name contains invalid characters");

const isoDateSchema = z
  .string()
  .trim()
  .max(40)
  .refine(
    (value) =>
      /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value) && !Number.isNaN(Date.parse(value)),
    "Invalid date",
  );

export const roomBookingCreateSchema = z.object({
  guestEmail: emailSchema,
  guestName: personNameSchema,
  guestPhone: phoneSchema,
  roomId: z.string().trim().min(1).max(100),
  // ISO datetime or YYYY-MM-DD.
  checkInDate: isoDateSchema,
  checkOutDate: isoDateSchema,
  numberOfGuests: z.number().int().min(1).max(20),
  specialRequests: z.string().max(1000).optional().default(""),
  // Price/nights are computed on the server. roomPriceNGN is honoured only
  // for admin-created manual bookings; numberOfNights is ignored.
  roomPriceNGN: z.number().positive().max(100000000).optional(),
  numberOfNights: z.number().int().min(1).max(60).optional(),
  // "PENDING" (manual booking) requires an admin session.
  paymentStatus: z.enum(["RESERVED", "PENDING"]).optional(),
});

export const dayPassCreateSchema = z.object({
  fullName: personNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  visitDate: z.string().min(10).max(40),
  // Honoured only for admin-created manual bookings; otherwise recomputed.
  totalAmount: z.number().positive().max(100000000).optional(),
  paymentStatus: z.enum(["RESERVED", "PENDING"]).optional(),
  // Marketing source of the browsing session (utm_source / referrer host).
  source: z
    .string()
    .trim()
    .toLowerCase()
    .max(60)
    .regex(/^[a-z0-9._-]+$/)
    .optional()
    .catch(undefined),
  items: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        quantity: z.number().int().min(1).max(200),
        price: z.number().min(0).max(100000000).optional(),
      }),
    )
    .min(1)
    .max(100),
});

export const confirmPaymentSchema = z.object({
  bookingId: z.coerce.string().trim().min(1).max(120),
  // Accepted for backwards compatibility but ignored: the server only ever
  // verifies the reference it stored on the booking.
  reference: z.string().trim().max(150).optional(),
});

export const BOOKING_STATUS_TRANSITIONS: Record<string, string[]> = {
  RESERVED: ["CANCELLED"],
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED"],
  CHECKED_IN: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const DAY_PASS_STATUS_TRANSITIONS: Record<string, string[]> = {
  RESERVED: ["CANCELLED"],
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["ACTIVATED", "CANCELLED"],
  ACTIVATED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const adminLoginSchema = z.object({
  identifier: z.string().trim().min(3).max(120),
  password: z.string().min(8).max(128),
});

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6).max(128),
});

export const userRegisterSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must include letters and numbers",
    ),
  firstName: z.string().trim().min(1).max(60).optional(),
  lastName: z.string().trim().min(1).max(60).optional(),
  phone: phoneSchema.optional(),
  country: z.string().trim().min(2).max(80).optional(),
  currency: z.string().trim().min(3).max(10).optional(),
});
