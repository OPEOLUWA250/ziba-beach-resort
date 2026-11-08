"use client";

import { useEffect, useState } from "react";
import { Sunset, Thermometer } from "lucide-react";
import type { ResortConditions as Conditions } from "@/app/api/conditions/route";

/**
 * "Sunset today 6:52pm · 29°C at the resort". Renders nothing until the
 * figures arrive, and nothing at all if they can't be fetched.
 */
export default function ResortConditions({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const [data, setData] = useState<Conditions | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/conditions")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Conditions | null) => {
        if (!cancelled && d && (d.sunset || d.temperatureC !== null)) setData(d);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null;

  const color = tone === "light" ? "text-white/85" : "text-slate-600";
  return (
    <p
      className={`flex items-center gap-x-3 gap-y-1 flex-wrap text-xs sm:text-sm font-light tracking-wide ${color} ${className}`}
      aria-label="Conditions at the resort today"
    >
      {data.sunset && (
        <span className="inline-flex items-center gap-1.5">
          <Sunset className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          Sunset today {data.sunset}
        </span>
      )}
      {data.sunset && data.temperatureC !== null && (
        <span aria-hidden="true" className="opacity-60">
          ·
        </span>
      )}
      {data.temperatureC !== null && (
        <span className="inline-flex items-center gap-1.5">
          <Thermometer className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          {data.temperatureC}°C at the resort
        </span>
      )}
    </p>
  );
}
