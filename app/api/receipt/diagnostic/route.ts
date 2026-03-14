import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Diagnostic endpoint to test database connectivity and check for specific booking
 */
export async function GET() {
  const diagnostics = {
    envCheck: {} as any,
    connectionTest: {} as any,
    bookingSearch: {} as any,
  };

  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    diagnostics.envCheck = {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "MISSING",
    };

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(diagnostics, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test connection with simple count
    const { count, error: countError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true });

    diagnostics.connectionTest = {
      success: !countError,
      error: countError?.message || null,
      totalBookings: count,
    };

    // Search for the specific booking we're testing with
    const testRef = "ZB-2026-67171";
    const { data: testBooking, error: searchError } = await supabase
      .from("bookings")
      .select(
        "id, booking_reference_code, guest_name, guest_email, payment_status",
      )
      .eq("booking_reference_code", testRef)
      .maybeSingle();

    diagnostics.bookingSearch = {
      reference: testRef,
      found: !!testBooking,
      data: testBooking,
      error: searchError?.message || null,
    };

    // Also fetch a few recent bookings
    const { data: recentBookings } = await supabase
      .from("bookings")
      .select("booking_reference_code, guest_name, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    const responsePayload = {
      ...diagnostics,
      recentBookings,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ...diagnostics,
        fatalError: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
