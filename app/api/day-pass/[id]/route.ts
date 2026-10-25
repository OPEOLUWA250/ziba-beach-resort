import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server/require-admin";
import { canViewBooking } from "@/lib/server/booking-access";
import { rateLimitByIp, tooManyRequests } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Day-pass booking details. Requires `?ref=<paystack ref>` matching the
 * booking (or an admin session) so booking IDs cannot be enumerated.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rate = await rateLimitByIp(request.headers, "api:daypass:get", 60, 60_000);
    if (!rate.allowed) return tooManyRequests(rate);

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseServer
      .from("day_pass_bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error && error.code !== "22P02") {
      console.error("[Day-Pass GET] Supabase error:", error.message);
      return NextResponse.json({ error: "Failed to load booking" }, { status: 500 });
    }

    if (!data || !(await canViewBooking(request, data))) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Transform database snake_case to camelCase for frontend
    const transformedData = {
      id: data.id,
      referenceCode: data.reference_code,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      visitDate: data.visit_date,
      items: data.items,
      totalAmount: data.total_amount,
      paymentStatus: data.payment_status,
      paystackReference: data.paystack_reference,
    };

    return NextResponse.json(transformedData);
  } catch (err: any) {
    console.error("[Day-Pass GET] Unexpected error:", err?.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Booking ID required" },
        { status: 400 },
      );
    }

    const { error } = await supabaseServer
      .from("day_pass_bookings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[Day-Pass DELETE] Supabase error:", error.message);
      return NextResponse.json(
        { error: `Failed to delete booking: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Day-Pass DELETE] Unexpected error:", err?.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
