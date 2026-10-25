"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import type { CheckInView } from "@/lib/server/check-in";
import { formatVisitDate } from "@/lib/utils/lagos-date";

export type { CheckInView };

const STATE_STYLES = {
  ready: {
    panel: "bg-green-900/30 border-green-700/60",
    icon: faCircleCheck,
    iconClass: "text-green-400",
    title: "Valid pass",
  },
  warning: {
    panel: "bg-amber-900/30 border-amber-700/60",
    icon: faTriangleExclamation,
    iconClass: "text-amber-400",
    title: "Check before admitting",
  },
  blocked: {
    panel: "bg-red-900/30 border-red-700/60",
    icon: faCircleXmark,
    iconClass: "text-red-400",
    title: "Do not admit",
  },
} as const;

export function formatLagosTime(iso: string | null) {
  if (!iso) return "";
  // Timestamps without a zone come from `timestamp` columns stored in UTC.
  const value = /[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? iso : `${iso}Z`;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function CheckInCard({
  booking,
  onUpdated,
}: {
  booking: CheckInView;
  onUpdated: (booking: CheckInView) => void;
}) {
  const [approve, setApprove] = useState(false);
  const [override, setOverride] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const style = justCheckedIn
    ? { ...STATE_STYLES.ready, title: "Checked in" }
    : STATE_STYLES[booking.state];
  const needsConfirm =
    (booking.requiresApproval && !approve) || (booking.dateMismatch !== null && !override);

  const handleCheckIn = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/check-in/${booking.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve, override }),
      });
      const body = await res.json().catch(() => ({}));
      if (body.booking) onUpdated(body.booking);
      if (!res.ok) {
        setError(body.error || "Check-in failed");
        return;
      }
      setJustCheckedIn(true);
    } catch {
      setError("Network error. Check the connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
      <div className={`border-b p-5 flex items-start gap-4 ${style.panel}`}>
        <FontAwesomeIcon icon={style.icon} className={`h-10 w-10 shrink-0 ${style.iconClass}`} />
        <div className="min-w-0">
          <p className="text-white text-2xl font-bold">{style.title}</p>
          {justCheckedIn ? (
            <p className="text-green-300 mt-1">
              Admit {booking.guests} guest{booking.guests === 1 ? "" : "s"}. Enjoy their day!
            </p>
          ) : (
            booking.messages.map((message) => (
              <p key={message} className="text-gray-200 mt-1">
                {message}
              </p>
            ))
          )}
          {booking.checkedInAt && (
            <p className="text-gray-300 text-sm mt-2">
              Checked in {formatLagosTime(booking.checkedInAt)}
              {booking.checkedInBy ? ` by ${booking.checkedInBy}` : ""}
            </p>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <p className="text-white text-xl font-semibold break-words">{booking.fullName}</p>
          <p className="text-gray-400 text-sm font-mono break-all">{booking.referenceCode}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-900/60 rounded-lg p-3">
            <p className="text-gray-400">Visit date</p>
            <p className="text-white font-semibold">{formatVisitDate(booking.visitDate, "short")}</p>
          </div>
          <div className="bg-gray-900/60 rounded-lg p-3">
            <p className="text-gray-400">Guests</p>
            <p className="text-white font-semibold text-lg">{booking.guests}</p>
          </div>
          <div className="bg-gray-900/60 rounded-lg p-3">
            <p className="text-gray-400">Total</p>
            <p className="text-white font-semibold">₦{booking.totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900/60 rounded-lg p-3">
            <p className="text-gray-400">Status</p>
            <p className="text-white font-semibold">
              {booking.paymentStatus}
              {booking.paymentType ? ` · ${booking.paymentType}` : ""}
            </p>
          </div>
        </div>

        <div className="bg-gray-900/60 rounded-lg p-3 text-sm">
          <p className="text-gray-400 mb-1">Tickets & add-ons</p>
          {booking.items.map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex justify-between text-gray-100">
              <span>{item.name}</span>
              <span>×{item.quantity}</span>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-sm break-all">
          {booking.phone} · {booking.email}
        </p>

        {booking.state !== "blocked" && !justCheckedIn && (
          <div className="space-y-3 pt-1">
            {booking.requiresApproval && (
              <label className="flex items-start gap-3 text-gray-200 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={approve}
                  onChange={(e) => setApprove(e.target.checked)}
                  className="mt-0.5 h-5 w-5 accent-amber-500"
                />
                {booking.paymentType === "online"
                  ? "Approve this paid booking and check in"
                  : "I have confirmed the guest has paid"}
              </label>
            )}
            {booking.dateMismatch && (
              <label className="flex items-start gap-3 text-gray-200 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={override}
                  onChange={(e) => setOverride(e.target.checked)}
                  className="mt-0.5 h-5 w-5 accent-amber-500"
                />
                Admit today even though the booking is for {formatVisitDate(booking.visitDate, "short")}
              </label>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleCheckIn}
              disabled={submitting || needsConfirm}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {submitting && <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin" />}
              Check in {booking.guests} guest{booking.guests === 1 ? "" : "s"}
            </button>
          </div>
        )}
        {booking.state === "blocked" && error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
