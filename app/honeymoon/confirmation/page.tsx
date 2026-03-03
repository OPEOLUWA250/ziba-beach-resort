"use client";

import { Suspense } from "react";
import HoneymoonConfirmationContent from "./confirmation-content";

export default function HoneymoonConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading confirmation...</div>}>
      <HoneymoonConfirmationContent />
    </Suspense>
  );
}
