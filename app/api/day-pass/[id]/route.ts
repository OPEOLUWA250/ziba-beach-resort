import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server";
import { getSessionCookieName, verifyAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function getSessionAdmin(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) return null;

  const session = verifyAdminSession(token);
  if (!session) return null;

  const { data: admin } = await supabaseServer
    .from("admin_users")
    .select("id, status")
    .eq("id", session.adminId)
    .maybeSingle();

  if (!admin || admin.status !== "active") return null;
  return admin;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      console.error("[Day-Pass GET] No ID provided");
      return NextResponse.json(
        { error: "Booking ID required" },
        { status: 400 },
      );
    }

    console.log("[Day-Pass GET] Fetching booking with ID:", id);

    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("[Day-Pass GET] Missing Supabase credentials");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("[Day-Pass GET] Querying day_pass_bookings table for ID:", id);
    const { data, error } = await supabase
      .from("day_pass_bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[Day-Pass GET] Supabase error:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 404 },
      );
    }

    if (!data) {
      console.error("[Day-Pass GET] No booking found for ID:", id);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    console.log("[Day-Pass GET] Booking found, transforming data");

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

    console.log("[Day-Pass GET] Returning booking data");
    return NextResponse.json(transformedData);
  } catch (err: any) {
    console.error("[Day-Pass GET] Unexpected error:", err);
    return NextResponse.json(
      { error: `Server error: ${err.message}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await getSessionAdmin(request);
    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      console.error("[Day-Pass DELETE] Supabase error:", error);
      return NextResponse.json(
        { error: `Failed to delete booking: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Day-Pass DELETE] Unexpected error:", err);
    return NextResponse.json(
      { error: `Server error: ${err.message}` },
      { status: 500 },
    );
  }
}
