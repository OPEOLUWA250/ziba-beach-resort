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

export const roomBookingCreateSchema = z.object({
  guestEmail: emailSchema,
  guestName: personNameSchema,
  guestPhone: phoneSchema,
  roomId: z.string().trim().min(1).max(100),
  checkInDate: z.string().datetime(),
  checkOutDate: z.string().datetime(),
  numberOfGuests: z.number().int().min(1).max(20),
  specialRequests: z.string().max(1000).optional().default(""),
  roomPriceNGN: z.number().positive().max(100000000),
  numberOfNights: z.number().int().min(1).max(60),
  paymentStatus: z.enum(["RESERVED", "PENDING"]).optional(),
});

export const dayPassCreateSchema = z.object({
  fullName: personNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  visitDate: z.string().min(10).max(40),
  totalAmount: z.number().positive().max(100000000),
  paymentStatus: z.enum(["RESERVED", "PENDING"]).optional(),
  items: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        quantity: z.number().int().min(1).max(200),
        price: z.number().min(0).max(100000000),
      }),
    )
    .min(1)
    .max(100),
});

export const confirmPaymentSchema = z.object({
  bookingId: z.string().trim().min(1).max(120),
  reference: z.string().trim().max(150).optional(),
});

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
