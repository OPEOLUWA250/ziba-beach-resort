import { NextRequest, NextResponse } from "next/server";
import { getAllRooms, createRoom } from "@/lib/services/rooms";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const rooms = await getAllRooms();

    return NextResponse.json({
      total: rooms.length,
      limit: 10,
      offset: 0,
      rooms,
      success: true,
    });
  } catch (error: any) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch rooms", success: false },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priceNGN, capacity, amenities, images } = body;

    if (!title || !priceNGN || !capacity) {
      return NextResponse.json(
        { error: "Missing required fields: title, priceNGN, capacity" },
        { status: 400 },
      );
    }

    const room = await createRoom({
      title,
      description,
      priceNGN,
      capacity,
      amenities,
      images,
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
