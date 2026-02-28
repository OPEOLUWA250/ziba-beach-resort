import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, email, bookingDetails } = body;

    if (!bookingId || !email) {
      return NextResponse.json(
        { error: "Missing bookingId or email" },
        { status: 400 },
      );
    }

    // Database operations removed - Supabase SDK only

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent successfully (mock)",
    });
  } catch (error: any) {
    console.error("Email endpoint error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send confirmation email" },
      { status: 500 },
    );
  }
}
