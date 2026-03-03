import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

export async function POST(request: Request) {
  try {
    const { packageName, packagePrice, guestName, email, phone, checkInDate } =
      await request.json();

    if (!packageName || !packagePrice || !guestName || !email || !phone) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const bookingId = uuidv4();
    const paystackReference = `HM-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Calculate price in kobo (Paystack uses kobo for NGN)
    const priceInKobo = Math.round(packagePrice * 100);

    // Insert into honeymoon_bookings table
    const { data, error } = await supabase.from("honeymoon_bookings").insert([
      {
        id: bookingId,
        package_name: packageName,
        package_price: packagePrice,
        guest_name: guestName,
        email: email,
        phone: phone,
        check_in_date: checkInDate,
        payment_status: "PENDING",
        paystack_reference: paystackReference,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);
      return Response.json(
        { error: "Failed to create booking" },
        { status: 500 },
      );
    }

    return Response.json({
      id: bookingId,
      paystackReference,
      amount: priceInKobo,
      message: "Booking created successfully",
    });
  } catch (err) {
    console.error("API error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
