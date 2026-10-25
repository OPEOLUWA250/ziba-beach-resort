import { after, NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getSessionAdmin } from "@/lib/admin-auth";
import { sendDayPassEmail } from "@/lib/server/day-pass-emails";
import { rateLimitByIp, tooManyRequests } from "@/lib/security/rate-limit";
import { dayPassCreateSchema } from "@/lib/security/validators";
import {
  generateDayPassReference,
  generatePaymentReference,
} from "@/lib/utils/booking-reference";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const rate = await rateLimitByIp(request.headers, "api:daypass:create", 30, 60_000);
    if (!rate.allowed) {
      return tooManyRequests(rate, "Too many booking attempts. Please retry shortly.");
    }

    const body = await request.json();
    const parsed = dayPassCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid day-pass payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { fullName, email, phone, visitDate, items, paymentStatus } = parsed.data;

    // Manual (PENDING, no online payment) bookings are an admin-only action.
    const isAdminCreated = paymentStatus === "PENDING";
    if (isAdminCreated && !(await getSessionAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const visit = new Date(visitDate);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (Number.isNaN(visit.getTime()) || visit < new Date(today.getTime() - 86_400_000)) {
      return NextResponse.json({ error: "Visit date must be today or later" }, { status: 400 });
    }

    // Validate that user has at least one valid ticket (any ticket except Infant alone)
    // Valid tickets: Items with "Ticket" in the name, excluding Infant Ticket
    const hasValidTicket = items.some(
      (item) => item.name.includes("Ticket") && !item.name.includes("Infant"),
    );

    if (!hasValidTicket) {
      return NextResponse.json(
        {
          error:
            items.every((item) => item.name.includes("Infant Ticket"))
              ? "Invalid booking: Infant tickets cannot be booked alone. Please add at least one ticketed guest (Kids, Teens, or Adult)."
              : "Invalid booking: You must select at least one ticket (Day Pass or Premium ticket). Add-on experiences alone cannot be booked.",
        },
        { status: 400 },
      );
    }

    // Price every item from the catalogue; client prices are ignored.
    const names = [...new Set(items.map((item) => item.name))];
    const { data: catalogue, error: catalogueError } = await supabaseServer
      .from("day_pass_experiences")
      .select("name, price_per_person, available")
      .in("name", names);

    if (catalogueError) {
      console.error("[Day-Pass Create] Catalogue lookup failed:", catalogueError.message);
      return NextResponse.json({ error: "Failed to price booking" }, { status: 500 });
    }

    const priceByName = new Map(
      (catalogue || [])
        .filter((row) => row.available !== false)
        .map((row) => [row.name, Number(row.price_per_person)]),
    );
    const unknown = names.filter((name) => !priceByName.has(name));
    if (unknown.length > 0) {
      return NextResponse.json(
        { error: `Unavailable item(s): ${unknown.join(", ")}` },
        { status: 400 },
      );
    }

    const pricedItems = items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: priceByName.get(item.name)!,
    }));
    const computedTotal = pricedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Admins may record a negotiated total for manual bookings.
    const totalAmount =
      isAdminCreated && parsed.data.totalAmount ? parsed.data.totalAmount : computedTotal;

    if (!isAdminCreated && !(totalAmount > 0)) {
      return NextResponse.json({ error: "Booking total must be greater than zero" }, { status: 400 });
    }

    // Set payment type based on creation source
    const paymentType = isAdminCreated ? "manual" : "online";
    const referenceCode = generateDayPassReference();

    // Only generate Paystack reference for customer bookings
    const paystackReference = isAdminCreated ? null : generatePaymentReference("dp");

    const row: Record<string, unknown> = {
      reference_code: referenceCode,
      full_name: fullName,
      email: email,
      phone: phone,
      visit_date: visitDate,
      items: pricedItems,
      total_amount: totalAmount,
      payment_status: paymentStatus || "RESERVED",
      payment_type: paymentType,
      date_of_booking: new Date().toISOString(),
      paystack_reference: paystackReference,
      source: isAdminCreated ? "admin" : parsed.data.source || "direct",
    };

    const insert = (fields: Record<string, unknown>) =>
      supabaseServer.from("day_pass_bookings").insert([fields]).select().single();

    let { data, error } = await insert(row);
    if (error?.code === "42703" || error?.code === "PGRST204") {
      // `source` column not migrated yet.
      const withoutSource = { ...row };
      delete withoutSource.source;
      ({ data, error } = await insert(withoutSource));
    }

    if (error || !data) {
      console.error("[Day-Pass Create] Insert failed:", error?.message);
      return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
    }

    // Admin-created bookings skip online payment, so send the guest their
    // pass (with check-in QR) now. Online bookings get it once paid.
    if (isAdminCreated) {
      const bookingId = String(data.id);
      after(() =>
        sendDayPassEmail("confirmation", bookingId).catch((err) =>
          console.error("[Day-Pass Create] Confirmation email failed:", err?.message),
        ),
      );
    }

    // Return response based on booking type
    const response: Record<string, unknown> = {
      id: data.id,
      referenceCode: referenceCode,
      totalAmount,
    };

    // Only include Paystack reference for customer bookings
    if (!isAdminCreated) {
      response.paystackReference = paystackReference;
    }

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("[Day-Pass Create] Error:", err?.message);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
