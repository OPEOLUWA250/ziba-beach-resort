import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return Response.json(
        { error: "Booking ID is required" },
        { status: 400 },
      );
    }

    // Update payment status to COMPLETED
    const { data, error } = await supabase
      .from("honeymoon_bookings")
      .update({ payment_status: "COMPLETED" })
      .eq("id", bookingId);

    if (error) {
      console.error("Supabase error:", error);
      return Response.json(
        { error: "Failed to update payment status" },
        { status: 500 },
      );
    }

    return Response.json({
      success: true,
      message: "Payment confirmed successfully",
    });
  } catch (err) {
    console.error("API error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
