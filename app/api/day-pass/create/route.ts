import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      visitDate,
      items,
      totalAmount,
      paymentStatus,
    } = body;

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

    // Determine if this is admin-created (PENDING) or customer booking (RESERVED)
    const isAdminCreated = paymentStatus === "PENDING";

    // Set payment type based on creation source
    const paymentType = isAdminCreated ? "manual" : "online";

    // Generate reference code (always generated for Ziba)
    const referenceCode = `ZB-DP-${Date.now()}`;

    // Only generate Paystack reference for customer bookings
    const paystackReference = isAdminCreated
      ? null
      : `dp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Save to database
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
          payment_status: paymentStatus || "RESERVED",
          payment_type: paymentType,
          date_of_booking: new Date().toISOString(),
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

    // Return response based on booking type
    const response: any = {
      id: data.id,
      referenceCode: referenceCode,
    };

    // Only include Paystack reference for customer bookings
    if (!isAdminCreated) {
      response.paystackReference = paystackReference;
    }

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Day-pass booking error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create booking" },
      { status: 500 },
    );
  }
}
