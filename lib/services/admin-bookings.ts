/**
 * Browser-side helpers for the admin dashboard. Everything goes through the
 * authenticated admin API routes; the browser never touches booking tables
 * directly.
 */

type BookingType = "room" | "day-pass";

async function fetchAllPages(type: BookingType) {
  const all: any[] = [];
  let offset = 0;

  // Paginate on the server; the dashboard filters and searches client-side,
  // so it still loads every page.
  for (let page = 0; page < 100; page++) {
    const res = await fetch(`/api/admin/bookings?type=${type}&offset=${offset}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to load bookings (${res.status})`);

    const body = await res.json();
    all.push(...(body.bookings || []));
    if (!body.hasMore) break;
    offset += body.limit;
  }

  return all;
}

export async function getAllBookings() {
  try {
    return await fetchAllPages("room");
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    return [];
  }
}

export async function getAllDayPassBookings() {
  try {
    return await fetchAllPages("day-pass");
  } catch (error) {
    console.error("Error in getAllDayPassBookings:", error);
    return [];
  }
}

async function patchStatus(url: string, status: string) {
  try {
    const res = await fetch(url, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Error updating booking status:", body?.error || res.status);
      return null;
    }
    return body.booking || null;
  } catch (error) {
    console.error("Error updating booking status:", error);
    return null;
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "COMPLETED" | "CANCELLED",
) {
  return patchStatus(`/api/bookings/${encodeURIComponent(bookingId)}/status`, status);
}

export async function updateDayPassBookingStatus(
  bookingId: string,
  status: "PENDING" | "CONFIRMED" | "ACTIVATED" | "COMPLETED" | "CANCELLED",
) {
  return patchStatus(`/api/day-pass/${encodeURIComponent(bookingId)}/status`, status);
}

/** Delete bookings in a single request. Returns the ids actually deleted. */
export async function deleteBookings(type: BookingType, ids: string[]): Promise<string[]> {
  if (ids.length === 0) return [];
  try {
    const res = await fetch("/api/admin/bookings", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ids }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Error deleting bookings:", body?.error || res.status);
      return [];
    }
    return (body.deletedIds || []).map(String);
  } catch (error) {
    console.error("Error deleting bookings:", error);
    return [];
  }
}

export async function deleteBooking(bookingId: string) {
  return (await deleteBookings("room", [bookingId])).length > 0;
}

export async function deleteDayPassBooking(bookingId: string) {
  return (await deleteBookings("day-pass", [bookingId])).length > 0;
}
