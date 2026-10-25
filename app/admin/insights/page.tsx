"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faSpinner } from "@fortawesome/free-solid-svg-icons";

interface Summary {
  sessions: number;
  steps: Record<string, number>;
  clicks: Record<string, number>;
  whatsapp_contexts: Array<{ context: string; clicks: number }>;
  sources: Array<{ source: string; sessions: number; daypass_checkouts: number; room_clicks: number }>;
  daily: Array<{ day: string; sessions: number }>;
}

interface InsightsResponse {
  days: number;
  analyticsReady: boolean;
  analytics: Summary | null;
  dayPass: {
    onlineBookings: number;
    onlineRevenue: number;
    staffBookings: number;
    bySource: Array<{ source: string; bookings: number; revenue: number }>;
  };
}

const RANGES = [7, 30, 90];

const FUNNEL: Array<{ key: string; label: string }> = [
  { key: "sessions", label: "Visited the site" },
  { key: "daypass_view", label: "Viewed day pass" },
  { key: "daypass_add_to_cart", label: "Added to cart" },
  { key: "daypass_cart_view", label: "Opened cart" },
  { key: "daypass_checkout_view", label: "Reached checkout" },
  { key: "daypass_payment_start", label: "Started payment" },
  { key: "daypass_paid", label: "Paid" },
];

const naira = (n: number) => `₦${Math.round(n).toLocaleString()}`;
const pct = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : "–");

function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 min-w-0">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white text-2xl sm:text-3xl font-bold mt-1 truncate">{value}</p>
      {hint && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
    </div>
  );
}

function Section({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
      <h2 className="text-white text-lg font-semibold">{title}</h2>
      {note && <p className="text-gray-400 text-sm mt-1">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function InsightsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/insights?days=${days}`, {
          credentials: "include",
          cache: "no-store",
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || "Failed to load insights");
        if (!cancelled) {
          setData(body);
          setError("");
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to load insights");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [days]);

  const a = data?.analytics;
  const stepValue = (key: string) => (key === "sessions" ? a?.sessions || 0 : a?.steps?.[key] || 0);
  const funnel = FUNNEL.map((step) => ({ ...step, value: stepValue(step.key) }));
  const top = funnel[0].value;

  // Largest relative drop between consecutive day-pass steps (after the
  // day-pass page, where intent is clear).
  let biggestDrop: { from: string; to: string; lost: number } | null = null;
  for (let i = 2; i < funnel.length; i++) {
    const prev = funnel[i - 1].value;
    if (prev < 5) continue; // too few sessions to call it
    const lost = 1 - funnel[i].value / prev;
    if (!biggestDrop || lost > biggestDrop.lost) {
      biggestDrop = { from: funnel[i - 1].label, to: funnel[i].label, lost };
    }
  }

  const revenueBySource = new Map(data?.dayPass.bySource.map((s) => [s.source, s]) || []);
  const sourceRows = [
    ...(a?.sources || []).map((s) => ({ ...s, ...(revenueBySource.get(s.source) || { bookings: 0, revenue: 0 }) })),
    // Sources with bookings but no tracked sessions (e.g. bookings made before tracking).
    ...(data?.dayPass.bySource || [])
      .filter((s) => !(a?.sources || []).some((x) => x.source === s.source))
      .map((s) => ({ sessions: 0, daypass_checkouts: 0, room_clicks: 0, ...s })),
  ];

  const maxDaily = Math.max(1, ...(a?.daily || []).map((d) => d.sessions));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-white cormorant">Insights</h1>
          <p className="text-gray-400">Where visitors come from, and where they drop off before booking</p>
        </div>
        <div className="flex rounded-lg border border-gray-700 overflow-hidden" role="group" aria-label="Date range">
          {RANGES.map((range) => (
            <button
              key={range}
              onClick={() => {
                if (range === days) return;
                setLoading(true);
                setDays(range);
              }}
              className={`px-4 py-2 text-sm font-medium ${
                days === range ? "bg-blue-900 text-white" : "bg-gray-800 text-gray-300 hover:text-white"
              }`}
            >
              {range} days
            </button>
          ))}
        </div>
      </div>

      {error && <div className="bg-red-900/30 border border-red-900/50 rounded-lg p-4 text-red-300">{error}</div>}

      {loading && !data ? (
        <div className="flex items-center justify-center gap-3 text-gray-400 py-16">
          <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin" />
          Loading…
        </div>
      ) : data ? (
        <div className={`space-y-6 ${loading ? "opacity-60" : ""}`}>
          {!data.analyticsReady && (
            <div className="bg-amber-900/30 border border-amber-800/60 rounded-xl p-4 flex gap-3 text-amber-100 text-sm">
              <FontAwesomeIcon icon={faCircleInfo} className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" />
              <p>
                Visitor tracking isn&apos;t switched on yet. Run the migration file
                <code className="mx-1 text-amber-200">20261025120000_guest_emails_checkin_analytics.sql</code>
                in the Supabase SQL editor. Booking and revenue figures below already work.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <StatTile label="Visitors" value={a ? a.sessions.toLocaleString() : "–"} hint="Browsing sessions" />
            <StatTile
              label="Day-pass bookings"
              value={data.dayPass.onlineBookings.toLocaleString()}
              hint={`Paid online${data.dayPass.staffBookings ? ` · +${data.dayPass.staffBookings} by staff` : ""}`}
            />
            <StatTile label="Day-pass revenue" value={naira(data.dayPass.onlineRevenue)} hint="Paid online" />
            <StatTile
              label="Room booking clicks"
              value={a ? (a.clicks.room_book_click || 0).toLocaleString() : "–"}
              hint="Sent to IPMS"
            />
            <StatTile
              label="WhatsApp clicks"
              value={a ? (a.clicks.whatsapp_click || 0).toLocaleString() : "–"}
              hint={a?.clicks.phone_click ? `+${a.clicks.phone_click} phone taps` : "Enquiries started"}
            />
          </div>

          {a && (
            <Section
              title="Day-pass funnel"
              note="Visitors who reached each step. Each percentage is of the step above."
            >
              <ol className="space-y-2.5">
                {funnel.map((step, index) => {
                  const width = top > 0 ? Math.max(step.value > 0 ? 1 : 0, (step.value / top) * 100) : 0;
                  return (
                    <li key={step.key} className="grid grid-cols-[minmax(0,9rem)_1fr_auto] sm:grid-cols-[12rem_1fr_7rem] items-center gap-3">
                      <span className="text-gray-300 text-sm truncate">{step.label}</span>
                      <div className="group relative h-6 bg-gray-900/70 rounded">
                        <div
                          className="h-full bg-blue-500 rounded transition-[width] duration-500"
                          style={{ width: `${width}%` }}
                        />
                        <span className="pointer-events-none absolute left-2 -top-8 z-10 hidden group-hover:block whitespace-nowrap rounded bg-gray-950 border border-gray-700 px-2 py-1 text-xs text-gray-100">
                          {step.value.toLocaleString()} visitors · {pct(step.value, top)} of all visitors
                        </span>
                      </div>
                      <span className="text-right text-sm tabular-nums">
                        <span className="text-white font-semibold">{step.value.toLocaleString()}</span>
                        {index > 0 && (
                          <span className="text-gray-400"> · {pct(step.value, funnel[index - 1].value)}</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ol>
              {biggestDrop && biggestDrop.lost > 0 && (
                <p className="text-gray-300 text-sm mt-4">
                  Biggest drop-off: <strong className="text-white">{biggestDrop.from}</strong> →{" "}
                  <strong className="text-white">{biggestDrop.to}</strong>. {Math.round(biggestDrop.lost * 100)}% of
                  visitors stop here.
                </p>
              )}
            </Section>
          )}

          {a && a.daily.length > 0 && (
            <Section title="Visitors per day">
              <div className="flex items-end gap-0.5 h-40" role="img" aria-label="Visitors per day">
                {a.daily.map((d) => (
                  <div key={d.day} className="group relative flex-1 h-full flex items-end">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${Math.max(2, (d.sessions / maxDaily) * 100)}%` }}
                    />
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 hidden group-hover:block whitespace-nowrap rounded bg-gray-950 border border-gray-700 px-2 py-1 text-xs text-gray-100">
                      {d.day}: {d.sessions} visitors
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-gray-500 text-xs mt-2">
                <span>{a.daily[0].day}</span>
                <span>{a.daily[a.daily.length - 1].day}</span>
              </div>
            </Section>
          )}

          <Section
            title="Where bookings come from"
            note="Source is the visitor's first link into the site. Tag your Instagram bio, ads and posts with ?utm_source=instagram (or facebook, tiktok…) to see them here."
          >
            {sourceRows.length === 0 ? (
              <p className="text-gray-400 text-sm">No data for this period yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 text-left border-b border-gray-700">
                      <th className="py-2 pr-3 font-medium">Source</th>
                      <th className="py-2 px-3 font-medium text-right">Visitors</th>
                      <th className="py-2 px-3 font-medium text-right">Started day-pass payment</th>
                      <th className="py-2 px-3 font-medium text-right">Room clicks</th>
                      <th className="py-2 px-3 font-medium text-right">Day passes paid</th>
                      <th className="py-2 pl-3 font-medium text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sourceRows.map((row) => (
                      <tr key={row.source} className="border-b border-gray-700/50 text-gray-200">
                        <td className="py-2 pr-3 font-medium text-white">{row.source}</td>
                        <td className="py-2 px-3 text-right tabular-nums">{row.sessions.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right tabular-nums">{row.daypass_checkouts.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right tabular-nums">{row.room_clicks.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right tabular-nums">{row.bookings.toLocaleString()}</td>
                        <td className="py-2 pl-3 text-right tabular-nums">{naira(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {a && a.whatsapp_contexts.length > 0 && (
            <Section title="WhatsApp enquiries by page">
              <ul className="divide-y divide-gray-700/60 text-sm">
                {a.whatsapp_contexts.map((row) => (
                  <li key={row.context} className="flex justify-between py-2 text-gray-200">
                    <span>{row.context}</span>
                    <span className="tabular-nums text-white font-semibold">{row.clicks}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      ) : null}
    </div>
  );
}
