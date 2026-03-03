"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import DayPassConfirmationContent from "./confirmation-content";

export default function DayPassConfirmationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-6 sm:py-8 px-4 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-900 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading your receipt...</p>
            </div>
          </div>
        }
      >
        <DayPassConfirmationContent />
      </Suspense>
    </main>
  );
}
