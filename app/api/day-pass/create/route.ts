import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, visitDate, items, totalAmount } = body;

    if (!fullName || !email || !phone || !visitDate || !items || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate reference code
    const referenceCode = `ZB-DP-${Date.now()}`;

    // Generate Paystack reference
    const paystackReference = `dp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Save to database with RESERVED while payment is in progress.
    // Booking should appear to admin only after real payment confirmation.
    const { data, error } = await supabase
      .from("day_pass_bookings")
      .insert([
        {
          reference_code: referenceCode,
          full_name: fullName,
          email: email,
          phone: phone,
          visit_date: visitDate,
          items: items,
          total_amount: totalAmount,
          payment_status: "RESERVED",
          paystack_reference: paystackReference,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving day-pass booking:", error);
      return NextResponse.json(
        { error: `Failed to save booking: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      id: data.id,
      paystackReference: paystackReference,
    });
  } catch (err: any) {
    console.error("Day-pass booking error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create booking" },
      { status: 500 },
    );
  }
}
