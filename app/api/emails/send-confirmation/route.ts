import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, email } = body;

    if (!bookingId || !email) {
      return NextResponse.json(
        { error: "Missing bookingId or email" },
        { status: 400 },
      );
    }

    // Get booking details from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error("Error fetching booking:", bookingError);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Get room details
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", booking.room_id)
      .single();

    if (roomError) {
      console.error("Error fetching room:", roomError);
    }

    // Calculate nights
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Format dates
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const checkInStr = dateFormatter.format(checkIn);
    const checkOutStr = dateFormatter.format(checkOut);

    // Get or generate booking reference code
    const bookingReference =
      booking.booking_reference_code ||
      `ZB-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")}`;

    // Update booking with reference code if not already present
    if (!booking.booking_reference_code) {
      await supabase
        .from("bookings")
        .update({ booking_reference_code: bookingReference })
        .eq("id", bookingId);
    }

    // Send confirmation email
    const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .section { margin: 20px 0; }
          .label { font-weight: bold; color: #667eea; }
          .value { margin: 5px 0 15px 0; font-size: 16px; }
          .booking-ref { background: #fff3cd; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; color: #856404; margin: 20px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your reservation at Ziba Beach Resort is confirmed</p>
          </div>
          <div class="content">
            <p>Dear ${booking.guest_name},</p>
            <p>Thank you for booking with us! Your payment has been received and your room is reserved. Below are your booking details.</p>

            <div class="booking-ref">
              Booking Reference: <strong>${bookingReference}</strong>
            </div>

            <div class="section">
              <div class="label">Guest Information</div>
              <div class="value">${booking.guest_name}<br>${booking.guest_email}<br>${booking.guest_phone}</div>
            </div>

            <div class="section">
              <div class="label">Room Details</div>
              <div class="value">${room?.name || booking.room_id}<br>Room Type: ${room?.roomType || "Standard"}</div>
            </div>

            <div class="section">
              <div class="label">Check-In & Check-Out</div>
              <div class="value">
                Check-In: ${checkInStr}<br>
                Check-Out: ${checkOutStr}<br>
                Duration: ${nights} night${nights > 1 ? "s" : ""}
              </div>
            </div>

            <div class="section">
              <div class="label">Guests</div>
              <div class="value">${booking.number_of_guests} guest${booking.number_of_guests > 1 ? "s" : ""}</div>
            </div>

            <div class="section">
              <div class="label">Booking Total</div>
              <div class="value" style="font-size: 20px; color: #667eea; font-weight: bold;">₦${booking.total_amount_ngn?.toLocaleString() || "0"}</div>
            </div>

            <div class="section">
              <strong>Important Check-In Information:</strong>
              <ul>
                <li>Check-in time: 2:00 PM</li>
                <li>Check-out time: 11:00 AM</li>
                <li>Please bring a valid government-issued ID</li>
                <li>Early check-in and late check-out subject to availability</li>
              </ul>
            </div>

            ${booking.special_requests ? `<div class="section"><strong>Special Requests:</strong><div class="value">${booking.special_requests}</div></div>` : ""}

            <div class="section" style="background: #e7f3ff; padding: 15px; border-radius: 5px;">
              <strong>Need Help?</strong><br>
              Contact us at +234 704 730 0013 or reply to this email with any questions.
            </div>

            <p>We look forward to hosting you at Ziba Beach Resort!</p>
            <p>Best regards,<br><strong>Ziba Beach Resort Team</strong></p>
          </div>
          <div class="footer">
            <p>Ziba Beach Resort | Okun Ajah, Lagos, Nigeria<br>
            <a href="https://zibabeachresort.com">www.zibabeachresort.com</a></p>
          </div>
        </div>
      </body>
    </html>
    `;

    const response = await resend.emails.send({
      from: "bookings@zibabeachresort.com",
      to: email,
      subject: `✅ Your Booking is Confirmed - Booking Reference: ${bookingReference}`,
      html: emailHtml,
    });

    if (!response.data?.id) {
      throw new Error("Failed to send email via Resend");
    }

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent successfully",
      emailId: response.data.id,
      bookingReference,
    });
  } catch (error: any) {
    console.error("Email endpoint error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send confirmation email" },
      { status: 500 },
    );
  }
}
