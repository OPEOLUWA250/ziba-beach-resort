import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendBookingConfirmation(
  email: string,
  booking: {
    id: string;
    checkInDate: Date;
    checkOutDate: Date;
    roomTitle: string;
    totalAmount: number;
    numberOfGuests: number;
  },
) {
  const checkInDate = new Date(booking.checkInDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const checkOutDate = new Date(booking.checkOutDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const nights = Math.ceil(
    (new Date(booking.checkOutDate).getTime() -
      new Date(booking.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const resend = getResendClient();
  return await resend.emails.send({
    from: "bookings@zibabeachresort.com",
    to: email,
    subject: "✅ Your Booking is Confirmed - Ziba Beach Resort",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">🎉 Booking Confirmed!</h1>
            <p style="color: #dbeafe; margin: 10px 0 0 0; font-size: 16px;">Thank you for choosing Ziba Beach Resort</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              We're thrilled you've chosen us for your getaway! Your booking is confirmed and your room is reserved.
            </p>

            <!-- Booking Details Card -->
            <div style="background: #f0f9ff; border-left: 4px solid #1e3a8a; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <h2 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Booking Details</h2>
              
              <div style="margin-bottom: 15px;">
                <p style="color: #666; margin: 0 0 5px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Booking Reference</p>
                <p style="color: #1e3a8a; margin: 0; font-size: 20px; font-weight: bold; font-family: 'Courier New', monospace;">${booking.id}</p>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
                <div>
                  <p style="color: #666; margin: 0 0 5px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Check-In</p>
                  <p style="color: #333; margin: 0; font-size: 15px; font-weight: 500;">${checkInDate}</p>
                </div>
                <div>
                  <p style="color: #666; margin: 0 0 5px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Check-Out</p>
                  <p style="color: #333; margin: 0; font-size: 15px; font-weight: 500;">${checkOutDate}</p>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
                <div>
                  <p style="color: #666; margin: 0 0 5px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Room</p>
                  <p style="color: #333; margin: 0; font-size: 15px; font-weight: 500;">${booking.roomTitle}</p>
                </div>
                <div>
                  <p style="color: #666; margin: 0 0 5px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Guests</p>
                  <p style="color: #333; margin: 0; font-size: 15px; font-weight: 500;">${booking.numberOfGuests} ${booking.numberOfGuests === 1 ? "Guest" : "Guests"}</p>
                </div>
              </div>

              <div>
                <p style="color: #666; margin: 0 0 5px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Total Amount</p>
                <p style="color: #059669; margin: 0; font-size: 24px; font-weight: bold;">₦${booking.totalAmount.toLocaleString()}</p>
                <p style="color: #999; margin: 5px 0 0 0; font-size: 12px;">${nights} ${nights === 1 ? "night" : "nights"}</p>
              </div>
            </div>

            <!-- Next Steps -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📋 What's Next?</h3>
              <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Check-in is at 2:00 PM and check-out at 11:00 AM</li>
                <li>We'll send you check-in instructions 24 hours before your arrival</li>
                <li>Our team is available 24/7 at +234-XXX-XXXX for any queries</li>
              </ul>
            </div>

            <!-- Footer Message -->
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              If you need to modify or cancel your booking, please contact us as soon as possible. We're here to help make your stay unforgettable!
            </p>

            <div style="text-align: center; margin-top: 40px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-bookings" style="display: inline-block; background: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">View Your Booking</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f3f4f6; padding: 20px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
              © 2026 Ziba Beach Resort. All rights reserved.<br/>
              <a href="https://zibabeachresort.com" style="color: #1e3a8a; text-decoration: none;">www.zibabeachresort.com</a>
            </p>
          </div>
        </div>
      </div>
    `,
  });
}
