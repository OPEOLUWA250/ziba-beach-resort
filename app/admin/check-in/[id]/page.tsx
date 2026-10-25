"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import CheckInCard, { type CheckInView } from "../check-in-card";

/** Landing page for a scanned day-pass QR code. */
export default function ScanCheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booking, setBooking] = useState<CheckInView | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/check-in/${encodeURIComponent(id)}`, {
          credentials: "include",
          cache: "no-store",
        });
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) setError(body.error || "Could not load this pass");
        else setBooking(body.booking);
      } catch {
        if (!cancelled) setError("Network error. Check the connection and try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <Link
        href="/admin/check-in"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="h-3.5 w-3.5" />
        Today&apos;s arrivals
      </Link>

      {error ? (
        <div className="bg-red-900/30 border border-red-700/60 rounded-2xl p-6">
          <p className="text-white text-2xl font-bold">Pass not found</p>
          <p className="text-gray-300 mt-1">{error}</p>
          <p className="text-gray-400 text-sm mt-3">
            Search by reference, name or phone on the arrivals page instead.
          </p>
        </div>
      ) : booking ? (
        <CheckInCard booking={booking} onUpdated={setBooking} />
      ) : (
        <div className="flex items-center gap-3 text-gray-400 py-12 justify-center">
          <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 animate-spin" />
          Loading pass…
        </div>
      )}
    </div>
  );
}
