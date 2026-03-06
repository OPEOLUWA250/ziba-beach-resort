import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimitByIp } from "@/lib/security/rate-limit";
import { dayPassCreateSchema } from "@/lib/security/validators";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const rate = rateLimitByIp(
      request.headers,
      "api:daypass:create",
      30,
      60_000,
    );
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many booking attempts. Please retry shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        },
      );
    }

    const body = await request.json();
    const parsed = dayPassCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid day-pass payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const {
      fullName,
      email,
      phone,
      visitDate,
      items,
      totalAmount,
      paymentStatus,
    } = parsed.data;

    // Validate that user has at least one valid ticket (any ticket except Infant alone)
    // Valid tickets: Items with "Ticket" in the name, excluding Infant Ticket
    const hasValidTicket = items.some(
      (item: any) =>
        item.name.includes("Ticket") && !item.name.includes("Infant"),
    );

    if (!hasValidTicket) {
      return NextResponse.json(
        {
          error:
            "Invalid booking: You must select at least one ticket (Day Pass or Premium ticket). Add-on experiences alone cannot be booked.",
        },
        { status: 400 },
      );
    }

    // Validate that infant tickets are not booked alone
    const hasInfant = items.some((item: any) =>
      item.name.includes("Infant Ticket"),
    );
    const hasOnlyInfant = items.every((item: any) =>
      item.name.includes("Infant Ticket"),
    );

    if (hasOnlyInfant) {
      return NextResponse.json(
        {
          error:
            "Invalid booking: Infant tickets cannot be booked alone. Please add at least one ticketed guest (Kids, Teens, or Adult).",
        },
        { status: 400 },
      );
    }

    if (hasInfant && !hasValidTicket) {
      return NextResponse.json(
        {
          error:
            "Invalid booking: Infant tickets must be accompanied by at least one ticketed guest (Kids, Teens, or Adult).",
        },
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
