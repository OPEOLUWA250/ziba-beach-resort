import { Check } from "lucide-react";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  guestName: string;
  amount: number;
  bookingId: string;
}

export default function PaymentSuccessModal({
  isOpen,
  guestName,
  amount,
  bookingId,
}: PaymentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h2>

        {/* Details */}
        <div className="bg-green-50 rounded-lg p-4 mb-6 text-left space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Guest:</span> {guestName}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Amount:</span> ₦
            {amount.toLocaleString()}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Booking ID:</span> {bookingId}
          </p>
        </div>

        {/* Loading indicator */}
        <div className="text-gray-600 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
          Redirecting to confirmation page...
        </div>
      </div>
    </div>
  );
}
