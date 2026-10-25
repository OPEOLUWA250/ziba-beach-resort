"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faQrcode,
  faRotateRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import type { CheckInView } from "./check-in-card";
import { formatVisitDate } from "@/lib/utils/lagos-date";

interface ListResponse {
  today: string;
  mode: "today" | "search";
  bookings: CheckInView[];
  counts: { bookings: number; guests: number; checkedIn: number; guestsCheckedIn: number } | null;
}

const PILL: Record<string, string> = {
  ACTIVATED: "bg-green-900/40 text-green-300 border-green-800",
  COMPLETED: "bg-green-900/40 text-green-300 border-green-800",
  CONFIRMED: "bg-blue-900/40 text-blue-300 border-blue-800",
  PENDING: "bg-amber-900/40 text-amber-300 border-amber-800",
  CANCELLED: "bg-red-900/40 text-red-300 border-red-800",
  RESERVED: "bg-gray-800 text-gray-400 border-gray-700",
};

const PILL_LABEL: Record<string, string> = {
  ACTIVATED: "Checked in",
  COMPLETED: "Checked out",
  CONFIRMED: "Expected",
  PENDING: "Needs approval",
  CANCELLED: "Cancelled",
  RESERVED: "Unpaid",
};

export default function CheckInHubPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (q: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/check-in?q=${encodeURIComponent(q)}`, {
        credentials: "include",
        cache: "no-store",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Failed to load arrivals");
      setData(body);
    } catch (err: any) {
      setError(err.message || "Failed to load arrivals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load("");
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void load(query.trim());
  };

  const counts = data?.counts;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-light text-white cormorant">Day-Pass Check-in</h1>
        <p className="text-gray-400">
          {data ? formatVisitDate(data.today) : "Today"}
        </p>
      </div>

      <div className="bg-blue-900/20 border border-blue-900/50 rounded-xl p-4 flex gap-3 text-sm text-blue-100">
        <FontAwesomeIcon icon={faQrcode} className="h-5 w-5 text-blue-300 shrink-0 mt-0.5" />
        <p>
          Scan the guest&apos;s QR code with your phone camera. It opens their pass here. No QR code?
          Search by reference, name, email or phone below.
        </p>
      </div>

      {counts && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <p className="text-gray-400 text-sm">Checked in</p>
            <p className="text-white text-3xl font-bold">
              {counts.checkedIn}
              <span className="text-gray-500 text-lg font-normal"> / {counts.bookings} bookings</span>
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <p className="text-gray-400 text-sm">Guests admitted</p>
            <p className="text-white text-3xl font-bold">
              {counts.guestsCheckedIn}
              <span className="text-gray-500 text-lg font-normal"> / {counts.guests} expected</span>
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Reference, name, email or phone"
            className="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-900 hover:bg-blue-800 text-white px-5 rounded-lg font-semibold"
        >
          Search
        </button>
        {data?.mode === "search" && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              void load("");
            }}
            className="text-gray-300 hover:text-white px-3 rounded-lg border border-gray-700"
            title="Back to today's arrivals"
          >
            <FontAwesomeIcon icon={faRotateRight} className="h-4 w-4" />
          </button>
        )}
      </form>

      {error && (
        <div className="bg-red-900/30 border border-red-900/50 rounded-lg p-4 text-red-300">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 text-gray-400 py-10">
          <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin" />
          Loading…
        </div>
      ) : data && data.bookings.length === 0 ? (
        <p className="text-gray-400 text-center py-10">
          {data.mode === "search" ? "No bookings match that search." : "No day-pass bookings for today."}
        </p>
      ) : (
        <ul className="space-y-2">
          {data?.bookings.map((booking) => (
            <li key={booking.id}>
              <Link
                href={`/admin/check-in/${booking.id}`}
                className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700/80 border border-gray-700 rounded-xl p-4 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold truncate">{booking.fullName}</p>
                  <p className="text-gray-400 text-xs font-mono truncate">
                    {booking.referenceCode}
                    {data.mode === "search" ? ` · ${formatVisitDate(booking.visitDate, "short")}` : ""}
                  </p>
                </div>
                <span className="text-gray-300 text-sm whitespace-nowrap">
                  {booking.guests} guest{booking.guests === 1 ? "" : "s"}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                    PILL[booking.paymentStatus] || PILL.RESERVED
                  }`}
                >
                  {PILL_LABEL[booking.paymentStatus] || booking.paymentStatus}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
