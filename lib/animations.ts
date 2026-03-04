"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationProps {
  threshold?: number;
}

export function useScrollAnimation(options: UseScrollAnimationProps = {}) {
  const { threshold = 0.1 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
}

export function getAnimationClass(
  isVisible: boolean,
  animationType:
    | "fadeInLeft"
    | "fadeInRight"
    | "fadeInUp"
    | "fadeInDown"
    | "scaleIn" = "fadeInUp",
  duration: number = 1000,
  delay: number = 0,
): string {
  const durationMs = `${duration}ms`;
  const delayMs = delay > 0 ? `${delay}ms` : "0ms";

  if (!isVisible) {
    return "opacity-0";
  }

  return `animate-${animationType}`;
}

// ============================================
// UNIFIED MOTION SYSTEM
// Standard easing curves and transitions
// ============================================

/**
 * Standard easing curves for consistent motion across the app
 */
export const easings = {
  // Default smooth easing for most UI elements
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)", // Tailwind's ease-out

  // Premium easing for elevated interactions
  premium: "cubic-bezier(0.25, 0.1, 0.25, 1)", // Smooth deceleration

  // Bouncy easing for playful micro-interactions
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",

  // Sharp easing for quick responses
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)",

  // Elastic easing for attention-grabbing elements
  elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

/**
 * Standard duration values (in ms)
 */
export const durations = {
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
} as const;

/**
 * Modal/Overlay transitions
 */
export const modalTransitions = {
  overlay: {
    enter: "transition-opacity duration-300 ease-out",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "transition-opacity duration-200 ease-in",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0",
  },
  panel: {
    enter: "transition-all duration-300 ease-out",
    enterFrom: "opacity-0 scale-95 translate-y-4",
    enterTo: "opacity-100 scale-100 translate-y-0",
    leave: "transition-all duration-200 ease-in",
    leaveFrom: "opacity-100 scale-100 translate-y-0",
    leaveTo: "opacity-0 scale-95 translate-y-4",
  },
} as const;

/**
 * Card/Item transitions
 */
export const cardTransitions = {
  hover:
    "transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl",
  tap: "active:scale-98 transition-transform duration-100",
} as const;

/**
 * Toast/Notification transitions
 */
export const toastTransitions = {
  enter: "transition-all duration-300 ease-out",
  enterFrom: "opacity-0 translate-y-2 scale-95",
  enterTo: "opacity-100 translate-y-0 scale-100",
  leave: "transition-all duration-200 ease-in",
  leaveFrom: "opacity-100 translate-y-0 scale-100",
  leaveTo: "opacity-0 -translate-y-2 scale-95",
} as const;

/**
 * Utility to generate transition style object
 */
export function getTransitionStyle(
  duration: number = durations.normal,
  easing: keyof typeof easings = "smooth",
  properties: string[] = ["all"],
) {
  return {
    transition: properties
      .map((prop) => `${prop} ${duration}ms ${easings[easing]}`)
      .join(", "),
  };
}

/**
 * Utility for staggered animations
 */
export function getStaggerDelay(
  index: number,
  baseDelay: number = 100,
): string {
  return `${index * baseDelay}ms`;
}
