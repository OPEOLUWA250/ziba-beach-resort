import prisma from "./prisma";
import type { Prisma } from "@prisma/client";

interface CreateBookingInput {
  userId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  specialRequests?: string;
}

/**
 * Check if a room is available for the given dates
 * @param roomId Room ID to check
 * @param checkInDate Check-in date (exclusive)
 * @param checkOutDate Check-out date (exclusive)
 * @returns true if available, false if there's a conflict
 */
export async function isRoomAvailable(
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
): Promise<boolean> {
  try {
    // Find any confirmed or pending bookings that overlap with requested dates
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        // Check for date overlaps
        // Conflict if: checkInDate < other.checkOutDate AND checkOutDate > other.checkInDate
        AND: [
          {
            checkInDate: {
              lt: checkOutDate, // existing booking starts before requested checkout
            },
          },
          {
            checkOutDate: {
              gt: checkInDate, // existing booking ends after requested checkin
            },
          },
        ],
      },
    });

    return !conflictingBooking;
  } catch (error) {
    console.error("Error checking room availability:", error);
    throw error;
  }
}

/**
 * Get all bookings for a specific room within a date range
 */
export async function getRoomBookings(
  roomId: string,
  startDate: Date,
  endDate: Date,
) {
  return prisma.booking.findMany({
    where: {
      roomId,
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
      AND: [
        {
          checkInDate: {
            lte: endDate,
          },
        },
        {
          checkOutDate: {
            gte: startDate,
          },
        },
      ],
    },
    select: {
      checkInDate: true,
      checkOutDate: true,
      status: true,
    },
  });
}

/**
 * Create a booking with atomic transaction
 * Uses database-level uniqueness constraint to prevent race conditions
 */
export async function createBooking(input: CreateBookingInput) {
  try {
    // Validate dates
    if (input.checkInDate >= input.checkOutDate) {
      throw new Error("Check-out date must be after check-in date");
    }

    if (input.checkInDate < new Date()) {
      throw new Error("Check-in date cannot be in the past");
    }

    // Double-check availability before creating
    const available = await isRoomAvailable(
      input.roomId,
      input.checkInDate,
      input.checkOutDate,
    );

    if (!available) {
      throw new Error("Room is not available for the selected dates");
    }

    // Use transaction for atomic operation
    const booking = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Attempt to create booking
        // This will fail at database level if unique constraint is violated
        try {
          const newBooking = await tx.booking.create({
            data: {
              userId: input.userId,
              roomId: input.roomId,
              checkInDate: input.checkInDate,
              checkOutDate: input.checkOutDate,
              numberOfGuests: input.numberOfGuests,
              specialRequests: input.specialRequests,
              status: "PENDING",
            },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  currency: true,
                },
              },
              room: {
                select: {
                  id: true,
                  title: true,
                  priceNGN: true,
                },
              },
            },
          });

          return newBooking;
        } catch (error) {
          const err = error as any;
          if (err?.code === "P2002") {
            // Unique constraint violation - room already booked
            throw new Error(
              "This room has been booked for the selected dates. Please choose different dates.",
            );
          }
          throw error;
        }
      },
      {
        // Ensure serializable isolation for full ACID compliance
        isolationLevel: "Serializable" as const,
        timeout: 5000,
      },
    );

    return booking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: string, userId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new Error("Unauthorized to cancel this booking");
    }

    if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
      throw new Error(`Cannot cancel a ${booking.status} booking`);
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
      include: {
        user: true,
        room: true,
        payment: true,
      },
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
}

/**
 * Get user's bookings
 */
export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      room: {
        select: {
          id: true,
          title: true,
          priceNGN: true,
          images: true,
        },
      },
      payment: {
        select: {
          status: true,
          amountNGN: true,
          userCurrency: true,
          userAmount: true,
          paystackReference: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Get booking details
 */
export async function getBookingDetails(bookingId: string) {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      room: true,
      payment: true,
      transactions: true,
    },
  });
}

/**
 * Calculate total price for a booking
 */
export function calculateBookingPrice(
  pricePerNightNGN: number,
  checkInDate: Date,
  checkOutDate: Date,
): number {
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return pricePerNightNGN * nights;
}

/**
 * Get available rooms for date range
 */
export async function getAvailableRooms(checkInDate: Date, checkOutDate: Date) {
  // Get all rooms
  const allRooms = await prisma.room.findMany({
    where: { status: "AVAILABLE" },
  });

  // Filter out booked rooms
  const bookedRooms = await prisma.booking.findMany({
    where: {
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
      AND: [
        {
          checkInDate: {
            lt: checkOutDate,
          },
        },
        {
          checkOutDate: {
            gt: checkInDate,
          },
        },
      ],
    },
    select: { roomId: true },
    distinct: ["roomId"],
  });

  const bookedRoomIds = bookedRooms.map((b: { roomId: string }) => b.roomId);

  return allRooms.filter(
    (room: { id: string }) => !bookedRoomIds.includes(room.id),
  );
}
