"use client";

import { Suspense } from "react";
import HoneymoonCheckoutContent from "./content";

export default function HoneymoonCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HoneymoonCheckoutContent />
    </Suspense>
  );
}
