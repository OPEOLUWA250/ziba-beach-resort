"use client";

import { X, CreditCard } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaystackClick: () => void;
  onWhatsAppClick: () => void;
  roomName: string;
  totalAmount: number;
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  isProcessing?: boolean;
}

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onPaystackClick,
  onWhatsAppClick,
  roomName,
  totalAmount,
  checkInDate,
  checkOutDate,
  guestName,
  isProcessing = false,
}: PaymentMethodModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white px-6 py-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold">Choose Payment Method</h2>
              <p className="text-blue-100 text-sm mt-1">
                Select how you'd like to proceed
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-blue-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-900">{roomName}</p>
            <p className="text-gray-600">
              {checkInDate} to {checkOutDate}
            </p>
            <p className="text-lg font-bold text-blue-900">
              ₦{totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Payment Options */}
        <div className="px-6 py-6 space-y-4">
          {/* Paystack Option */}
          <button
            onClick={onPaystackClick}
            disabled={isProcessing}
            className="w-full border-2 border-blue-600 bg-white text-blue-900 py-4 rounded-lg hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 px-4 group"
          >
            <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition">
              <CreditCard className="w-6 h-6 text-blue-900" />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold">Pay with Paystack</p>
              <p className="text-xs text-gray-600">Fast, secure card payment</p>
            </div>
          </button>

          {/* WhatsApp Option */}
          <button
            onClick={onWhatsAppClick}
            disabled={isProcessing}
            className="w-full border-2 border-green-500 bg-white text-green-700 py-4 rounded-lg hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 px-4 group"
          >
            <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition">
              <FontAwesomeIcon
                icon={faWhatsapp}
                className="w-6 h-6 text-green-700"
              />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold">Pay with Ziba Agent</p>
              <p className="text-xs text-gray-600">
                Chat with our team on WhatsApp
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            Your booking details will be shared securely with your chosen
            payment method
          </p>
        </div>
      </div>
    </div>
  );
}
