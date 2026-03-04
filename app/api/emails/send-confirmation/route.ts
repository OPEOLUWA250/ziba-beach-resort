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

    if (!process.env.RESEND_API_KEY) {
      console.warn(
        "[Send Confirmation] RESEND_API_KEY missing. Skipping email send.",
      );
      return NextResponse.json({
        success: false,
        skipped: true,
        message: "Email provider not configured",
      });
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

    // Build receipt URL
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://zibabeachresort.com";
    const receiptUrl = `${appUrl}/booking-confirmation?bookingId=${bookingId}`;

    // Send confirmation email with detailed receipt
    const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            color: #333; 
            background: #f0f4ff;
            margin: 0;
            padding: 20px;
          }
          .wrapper { background: #ffffff; margin: 20px auto; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { 
            background: #001a4d; 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 12px 12px 0 0;
          }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .header p { margin: 8px 0 0 0; opacity: 0.9; }
          .receipt-body { 
            background: #f9fafb; 
            padding: 30px; 
          }
          .ref-box { 
            background: #059669;
            border: 2px solid #0ea877;
            color: white;
            padding: 16px; 
            border-radius: 8px; 
            text-align: center; 
            margin: 20px 0;
            font-size: 14px;
          }
          .ref-box .label { color: #e0f2fe; font-size: 12px; }
          .ref-box .code { 
            font-family: 'Courier New', monospace;
            font-size: 18px; 
            font-weight: bold; 
            margin-top: 8px;
            word-break: break-all;
          }
          .view-receipt-btn {
            display: inline-block;
            width: 100%;
            background: #0066cc;
            color: white;
            padding: 14px;
            text-align: center;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            font-size: 16px;
            border: none;
            box-sizing: border-box;
          }
          .info-grid { 
            margin: 20px 0;
          }
          .info-row { 
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-label { 
            font-weight: 600;
            color: #374151;
          }
          .info-value { 
            color: #1f2937;
            text-align: right;
            font-size: 14px;
          }
          .guest-section{
            background: white;
            padding: 16px;
            border-radius: 8px;
            margin: 15px 0;
            border: 1px solid #e5e7eb;
          }
          .section-title { 
            font-weight: bold; 
            color: #001a4d;
            font-size: 14px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .details-grid{
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin: 15px 0;
          }
          .detail-box{
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            text-align: center;
            flex: 1;
            min-width: 120px;
          }
          .detail-label { 
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
          }
          .detail-value { 
            font-size: 14px;
            font-weight: bold;
            color: #001a4d;
          }
          .room-box{
            background: #dbeafe;
            border: 2px solid #0ea877;
            padding: 16px;
            border-radius: 8px;
            margin: 15px 0;
          }
          .room-label{
            font-size: 12px;
            color: #374151;
            font-weight: 600;
            margin-bottom: 6px;
          }
          .room-name { 
            font-size: 16px;
            font-weight: bold;
            color: #001a4d;
          }
          .amount-box{
            background: #dcfce7;
            border: 2px solid #16a34a;
            padding: 16px;
            border-radius: 8px;
            margin: 15px 0;
          }
          .amount-label { 
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .amount-label .label { 
            font-weight: 600;
            color: #374151;
          }
          .status-badge{
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          .amount-total{
            font-size: 24px;
            font-weight: bold;
            color: #16a34a;
          }
          .important-box{
            background: #fef3c7;
            border: 2px solid #fbbf24;
            padding: 16px;
            border-radius: 8px;
            margin: 15px 0;
          }
          .important-title{
            font-weight: bold;
            color: #92400e;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .important-box ul{
            margin: 0;
            padding-left: 20px;
            color: #78350f;
            font-size: 13px;
          }
          .important-box li{
            margin: 6px 0;
          }
          .help-box{
            background: #eff6ff;
            border-left: 4px solid #001a4d;
            padding: 16px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .help-title { 
            font-weight: bold;
            color: #001a4d;
            margin-bottom: 6px;
          }
          .help-text{
            font-size: 14px;
            color: #374151;
          }
          .help-text a{
            color: #001a4d;
            font-weight: bold;
            text-decoration: none;
          }
          .receipt-body {
            border-radius: 0 0 12px 12px;
          }
          .footer { 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
            margin-top: 30px; 
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
          .footer a{
            color: #001a4d;
            text-decoration: none;
          }
          .sign-off{
            margin-top: 20px;
            font-size: 14px;
            color: #374151;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>✅ Payment Successful</h1>
              <p>Ziba Beach Resort - Your Booking Receipt</p>
            </div>

            <!-- Receipt Body -->
            <div class="receipt-body">
              <p>Dear <strong>${booking.guest_name}</strong>,</p>
              <p>Thank you for booking with us! Your payment has been received and your room is confirmed. Below is your detailed booking receipt.</p>

              <!-- Reference Code -->
              <div class="ref-box">
                <div class="label">Booking Reference Code</div>
                <div class="code">${bookingReference}</div>
              </div>

              <!-- View Receipt Button -->
              <a href="${receiptUrl}" style="display: inline-block; width: 100%; background: #0066cc; color: white; padding: 14px; text-align: center; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; font-size: 16px; box-sizing: border-box;">📄 View & Download Receipt</a>

              <!-- Guest Information -->
              <div class="guest-section">
                <div class="section-title">Guest Information</div>
                <div class="info-grid">
                  <div class="info-row">
                    <div class="info-label">Name</div>
                    <div class="info-value">${booking.guest_name}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Email</div>
                    <div class="info-value">${booking.guest_email}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Phone</div>
                    <div class="info-value">${booking.guest_phone}</div>
                  </div>
                </div>
              </div>

              <!-- Room Type -->
              <div class="room-box">
                <div class="room-label">Room Type</div>
                <div class="room-name">${room?.name || booking.room_id}</div>
              </div>

              <!-- Stay Details Grid -->
              <div class="details-grid">
                <div class="detail-box">
                  <div class="detail-label">Check In</div>
                  <div class="detail-value">${checkInStr}</div>
                </div>
                <div class="detail-box">
                  <div class="detail-label">Check Out</div>
                  <div class="detail-value">${checkOutStr}</div>
                </div>
                <div class="detail-box">
                  <div class="detail-label">Duration</div>
                  <div class="detail-value">${nights} Night${nights > 1 ? "s" : ""}</div>
                </div>
                <div class="detail-box">
                  <div class="detail-label">Guests</div>
                  <div class="detail-value">${booking.number_of_guests}</div>
                </div>
              </div>

              <!-- Total Amount -->
              <div class="amount-box">
                <div class="amount-label">
                  <span class="label">Total Amount</span>
                  <span class="status-badge">Payment Received</span>
                </div>
                <div class="amount-total">₦${booking.total_amount_ngn?.toLocaleString() || "0"}</div>
              </div>

              ${
                booking.special_requests
                  ? `
              <div class="guest-section">
                <div class="section-title">Special Requests</div>
                <p style="margin: 0; color: #374151; font-size: 14px;">${booking.special_requests}</p>
              </div>
              `
                  : ""
              }

              <!-- Important Information -->
              <div class="important-box">
                <div class="important-title">⚡ Important Check-In Information</div>
                <ul>
                  <li><strong>Check-in Time:</strong> 3:00 PM</li>
                  <li><strong>Check-out Time:</strong> 12:00 PM</li>
                  <li><strong>ID Required:</strong> Please bring a valid government-issued ID</li>
                  <li><strong>Early Check-in/Late Check-out:</strong> Subject to availability</li>
                </ul>
              </div>

              <!-- Help Section -->
              <div class="help-box">
                <div class="help-title">Need Help?</div>
                <div class="help-text">
                  Contact us at <a href="tel:+2347047300013">+234 704 730 0013</a> or reply to this email with any questions.
                </div>
              </div>

              <div class="sign-off">
                <p>We look forward to hosting you at Ziba Beach Resort!</p>
                <p><strong>Best regards,</strong><br>
                <strong>Ziba Beach Resort Team</strong></p>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>Ziba Beach Resort | Okun Ajah, Lagos, Nigeria<br>
              <a href="https://zibabeachresort.com">www.zibabeachresort.com</a><br>
              <span style="font-size: 11px; color: #999;">This is your booking confirmation receipt. Please keep it for your records.</span></p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;

    console.log("📧 Attempting to send email with Resend...");
    console.log("📧 To:", email);
    console.log("📧 Booking Reference:", bookingReference);

    let response;
    try {
      response = await resend.emails.send({
        from: "bookings@zibabeachresort.com",
        to: email,
        subject: `✅ Your Booking is Confirmed - Booking Reference: ${bookingReference}`,
        html: emailHtml,
      });
      console.log("📧 Resend Response:", JSON.stringify(response, null, 2));
    } catch (resendError: any) {
      console.error("❌ Resend API Error:", resendError);
      return NextResponse.json({
        success: false,
        skipped: true,
        message: `Email send skipped: ${resendError.message || "provider error"}`,
      });
    }

    if (!response.data?.id) {
      console.error("❌ Email send failed. Response:", response);
      return NextResponse.json({
        success: false,
        skipped: true,
        message:
          response.error?.message ||
          "Email provider did not return a message id",
      });
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
