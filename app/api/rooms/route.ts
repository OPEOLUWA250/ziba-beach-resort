import { requireAdmin } from "@/lib/server/require-admin";
import { NextRequest, NextResponse } from "next/server";
import { getAllRooms } from "@/lib/services/rooms";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
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
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const { title, description, priceNGN, capacity, amenities, images } = body;

    if (!title || !priceNGN || !capacity) {
      return NextResponse.json(
        { error: "Missing required fields: title, priceNGN, capacity" },
        { status: 400 },
      );
    }

    const roomId = `room-${Date.now()}`;
    const now = new Date().toISOString();
    const { error } = await supabaseServer.from("rooms").insert({
      id: roomId,
      title,
      description: description || "",
      pricengn: priceNGN,
      capacity,
      amenities: amenities || [],
      images: images || [],
      status: "available",
      createdAt: now,
      updatedAt: now,
    });

    if (error) throw error;

    return NextResponse.json(
      { id: roomId, title, description, pricengn: priceNGN, capacity, amenities, images, status: "available" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create room" },
      { status: 500 },
    );
  }
}
