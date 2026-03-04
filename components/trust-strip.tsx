"use client";

import { Shield, CheckCircle, MapPin, Headphones } from "lucide-react";
import { useScrollAnimation } from "@/lib/animations";

const trustBadges = [
  {
    icon: Shield,
    title: "Secure Payment",
    description: "256-bit SSL encryption",
    color: "blue",
  },
  {
    icon: CheckCircle,
    title: "Instant Confirmation",
    description: "Immediate booking receipt",
    color: "green",
  },
  {
    icon: MapPin,
    title: "Beachfront Location",
    description: "Prime oceanside access",
    color: "cyan",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
    color: "purple",
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    iconBg: "bg-blue-100",
    border: "border-blue-200",
  },
  green: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    iconBg: "bg-emerald-100",
    border: "border-emerald-200",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
    iconBg: "bg-cyan-100",
    border: "border-cyan-200",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    iconBg: "bg-purple-100",
    border: "border-purple-200",
  },
} as const;

export default function TrustStrip() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-slate-50 to-white border-y border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            const colors =
              colorClasses[badge.color as keyof typeof colorClasses];

            return (
              <div
                key={badge.title}
                className={`group flex flex-col items-center text-center p-6 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-500 ease-out hover:-translate-y-1 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {/* Icon Container */}
                <div
                  className={`w-14 h-14 rounded-full ${colors.iconBg} flex items-center justify-center mb-4 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className={`w-7 h-7 ${colors.icon}`} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-gray-900 font-semibold text-base mb-1 tracking-tight">
                  {badge.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm font-light">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
