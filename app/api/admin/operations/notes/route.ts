import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const bookingId = request.nextUrl.searchParams.get("bookingId");

    if (bookingId) {
      const { data, error } = await supabaseServer
        .from("operations_booking_notes")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json({ success: true, notes: data || [] });
    }

    const { data, error } = await supabaseServer
      .from("operations_booking_notes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;
    return NextResponse.json({ success: true, notes: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, note, noteType = "note", createdBy = "operations-admin" } = body;

    if (!bookingId || !note) {
      return NextResponse.json(
        { error: "bookingId and note are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseServer
      .from("operations_booking_notes")
      .upsert(
        {
          booking_id: bookingId,
          note,
          note_type: noteType,
          created_by: createdBy,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "booking_id,note_type" },
      )
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, note: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to save note" },
      { status: 500 },
    );
  }
}
