import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { error: "Booking ID is required" },
        { status: 400 },
      );
    }

    // Retrieve booking with retry mechanism
    let booking = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (!booking && attempts < maxAttempts) {
      const { data, error } = await supabase
        .from("honeymoon_bookings")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        booking = data;
        break;
      }

      if (error && error.code !== "PGRST116") {
        // If it's not a "not found" error, throw
        throw error;
      }

      attempts++;
      if (attempts < maxAttempts) {
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    return Response.json(booking);
  } catch (err) {
    console.error("API error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
