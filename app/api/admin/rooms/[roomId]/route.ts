import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Update room
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const { roomId } = await params;
    let body = await request.json();

    // Map price to pricengn and normalize status
    if ("price" in body && !("pricengn" in body)) {
      body.pricengn = body.price;
      delete body.price;
    }
    if (body.status) {
      body.status = body.status.toLowerCase();
    }

    const { data, error } = await supabaseServer
      .from("rooms")
      .update(body)
      .eq("id", roomId)
      .select()
      .single();

    if (error) throw error;

    // Normalize response
    const normalizedRoom = {
      ...data,
      price: data.pricengn,
      status: data.status?.toLowerCase() || "available",
    };

    return NextResponse.json({
      success: true,
      room: normalizedRoom,
    });
  } catch (error: any) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update room" },
      { status: 500 },
    );
  }
}

// Delete room
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const { roomId } = await params;

    const { error } = await supabaseServer
      .from("rooms")
      .delete()
      .eq("id", roomId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete room" },
      { status: 500 },
    );
  }
}
