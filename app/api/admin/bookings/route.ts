import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server/require-admin";

export const dynamic = "force-dynamic";

const MAX_PAGE_SIZE = 500;

const ROOM_COLUMNS = [
  "id",
  "booking_reference_code",
  "guest_name",
  "guest_email",
  "guest_phone",
  "room_id",
  "check_in_date",
  "check_out_date",
  "number_of_guests",
  "special_requests",
  "room_price_ngn",
  "number_of_nights",
  "total_amount_ngn",
  "payment_status",
  "payment_type",
  "date_of_booking",
  "paystack_reference",
  "paid_at",
  "updated_at",
  "created_at",
];

const DAY_PASS_COLUMNS = [
  "id",
  "reference_code",
  "full_name",
  "email",
  "phone",
  "visit_date",
  "items",
  "total_amount",
  "payment_status",
  "payment_type",
  "date_of_booking",
  "paystack_reference",
  "created_at",
];

// Columns some deployments may not have yet; dropped on a 42703 retry.
const OPTIONAL_COLUMNS = ["paid_at", "updated_at", "date_of_booking"];

function tableFor(type: string | null) {
  if (type === "day-pass") return { table: "day_pass_bookings", columns: DAY_PASS_COLUMNS };
  if (type === "room" || !type) return { table: "bookings", columns: ROOM_COLUMNS };
  return null;
}

/**
 * GET /api/admin/bookings?type=room|day-pass&limit=500&offset=0
 * One page of non-RESERVED bookings, newest first. `hasMore` tells the
 * client whether to request the next page.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const params = request.nextUrl.searchParams;
  const target = tableFor(params.get("type"));
  if (!target) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(params.get("limit")) || MAX_PAGE_SIZE));
  const offset = Math.max(0, Number(params.get("offset")) || 0);

  const run = (columns: string[]) =>
    supabaseServer
      .from(target.table)
      .select(columns.join(","))
      .neq("payment_status", "RESERVED")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

  let { data, error } = await run(target.columns);
  if (error?.code === "42703") {
    const fallback = target.columns.filter((c) => !OPTIONAL_COLUMNS.includes(c));
    ({ data, error } = await run(fallback));
    data = (data || []).map((row: any) => ({
      ...row,
      ...Object.fromEntries(
        OPTIONAL_COLUMNS.filter((c) => target.columns.includes(c)).map((c) => [c, null]),
      ),
    }));
  }

  if (error) {
    console.error(`[Admin Bookings] List ${target.table} failed:`, error.message);
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 });
  }

  const rows = data || [];
  return NextResponse.json({ bookings: rows, hasMore: rows.length === limit, offset, limit });
}

/**
 * DELETE /api/admin/bookings  body: { type: "room" | "day-pass", ids: string[] }
 * Deletes all ids in one statement.
 */
export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const body = await request.json().catch(() => ({}));
  const target = tableFor(body?.type ?? null);
  const ids: string[] = Array.isArray(body?.ids)
    ? body.ids.map((id: unknown) => String(id)).filter(Boolean).slice(0, 500)
    : [];

  if (!target || ids.length === 0) {
    return NextResponse.json({ error: "type and ids are required" }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from(target.table)
    .delete()
    .in("id", ids)
    .select("id");

  if (error) {
    console.error(`[Admin Bookings] Delete from ${target.table} failed:`, error.message);
    return NextResponse.json({ error: "Failed to delete bookings" }, { status: 500 });
  }

  console.log(
    `[Admin Bookings] ${auth.admin.username} deleted ${data?.length ?? 0} row(s) from ${target.table}`,
  );
  return NextResponse.json({ success: true, deletedIds: (data || []).map((row) => row.id) });
}
