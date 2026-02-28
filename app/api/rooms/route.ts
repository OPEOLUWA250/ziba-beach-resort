import { NextRequest, NextResponse } from "next/server";
import { getRoomHeroImage } from "@/lib/room-images";

export const dynamic = "force-dynamic";

// Mock rooms for development - matching room detail page structure
const MOCK_ROOMS = [
  {
    id: "room01",
    title: "Beach Facing Room",
    description:
      "Experience the essence of beach luxury with stunning ocean views and direct access to our pristine shoreline. Perfect for couples or small families seeking an intimate getaway.",
    priceNGN: 202000,
    capacity: 3,
    amenities: [
      "WiFi",
      "Minibar",
      "Room Service",
      "Daily Housekeeping",
      "Safe Deposit Box",
      "Wake-up Service",
      "24/7 Concierge",
      "Beach Towel Service",
    ],
    images: [getRoomHeroImage("room01")],
    status: "AVAILABLE",
  },
  {
    id: "room02",
    title: "Beach Facing Family Room",
    description:
      "Partial View - Spacious family accommodation with flexible sleeping arrangements, perfect for creating unforgettable memories with loved ones.",
    priceNGN: 225000,
    capacity: 6,
    amenities: [
      "WiFi",
      "Minibar",
      "Kids Welcome Package",
      "Childminding Service Available",
      "Room Service",
      "Family Beach Amenities",
      "Game Console",
      "Beach Equipment",
    ],
    images: [getRoomHeroImage("room02")],
    status: "AVAILABLE",
  },
  {
    id: "room03",
    title: "Beach Facing Family Room",
    description:
      "Full View - Premium family space with expansive pool and ocean views, offering the perfect backdrop for quality family time.",
    priceNGN: 247500,
    capacity: 6,
    amenities: [
      "WiFi",
      "Minibar",
      "Kids Welcome Package",
      "Childminding Service Available",
      "Room Service",
      "Family Beach Amenities",
      "Game Console",
      "Beach Equipment",
      "Private Balcony",
    ],
    images: [getRoomHeroImage("room03")],
    status: "AVAILABLE",
  },
  {
    id: "room04",
    title: "Deluxe Sea-Facing Room",
    description:
      "Elegantly designed with a blend of modern comfort and traditional charm, featuring contemporary bathroom fixtures and premium bedding.",
    priceNGN: 213000,
    capacity: 2,
    amenities: [
      "WiFi",
      "Minibar",
      "Room Service",
      "Daily Housekeeping",
      "Safe Deposit Box",
      "Wake-up Service",
      "24/7 Concierge",
      "Premium Toiletries",
    ],
    images: [getRoomHeroImage("room04")],
    status: "AVAILABLE",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { default: prisma } = await import("@/lib/services/prisma");

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status") || "AVAILABLE";

    const rooms = await prisma.room.findMany({
      where: {
        status,
      },
      skip: offset,
      take: limit,
    });

    const total = await prisma.room.count({
      where: { status },
    });

    return NextResponse.json({
      total,
      limit,
      offset,
      rooms,
    });
  } catch (error: any) {
    console.error("Error fetching rooms from database:", error);
    // Return mock rooms as fallback
    return NextResponse.json({
      total: MOCK_ROOMS.length,
      limit: 10,
      offset: 0,
      rooms: MOCK_ROOMS,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { default: prisma } = await import("@/lib/services/prisma");
    const body = await request.json();
    const { title, description, priceNGN, capacity, amenities, images } = body;

    if (!title || !priceNGN || !capacity) {
      return NextResponse.json(
        { error: "Missing required fields: title, priceNGN, capacity" },
        { status: 400 },
      );
    }

    const room = await prisma.room.create({
      data: {
        title,
        description,
        priceNGN,
        capacity,
        amenities: amenities || [],
        images: images || [],
        status: "AVAILABLE",
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error: any) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create room" },
      { status: 500 },
    );
  }
}
