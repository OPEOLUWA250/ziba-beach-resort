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
