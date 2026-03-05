import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Get all rooms (admin view - no status filter)
export async function GET(request: NextRequest) {
  try {
    const { data: rooms, error } = await supabaseServer
      .from("rooms")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    // Normalize data: map field names and normalize status to lowercase
    const normalizedRooms = (rooms || []).map((room: any) => ({
      ...room,
      price: room.pricengn, // Map pricengn to price for frontend
      status: room.status?.toLowerCase() || "available",
    }));

    return NextResponse.json({
      success: true,
      total: normalizedRooms.length,
      rooms: normalizedRooms,
    });
  } catch (error: any) {
    console.error("Error fetching admin rooms:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch rooms" },
      { status: 500 },
    );
  }
}
