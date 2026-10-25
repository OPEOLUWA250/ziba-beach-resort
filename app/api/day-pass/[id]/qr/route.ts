import { NextRequest, NextResponse } from "next/server";
import { isBookingId, renderCheckInQr } from "@/lib/server/day-pass-qr";

export const dynamic = "force-dynamic";

/**
 * Check-in QR code (PNG) for a day-pass booking, used by the guest emails and
 * the confirmation page. It only encodes the staff check-in URL for the id
 * in the path, so it reads nothing from the database and reveals nothing.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!isBookingId(id)) {
    return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
  }

  const png = await renderCheckInQr(id);
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
    },
  });
}
