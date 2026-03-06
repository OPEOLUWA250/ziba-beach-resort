"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Minus, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface SavedCart {
  items: CartItem[];
  visitDate: string | null;
  totalAmount: number;
}

export default function DayPassCart() {
  const router = useRouter();
  const [cart, setCart] = useState<SavedCart>({
    items: [],
    visitDate: null,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("dayPassCart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (err) {
          console.error("Failed to load cart:", err);
        }
      }
      setLoading(false);
    }
  }, []);

  const saveCart = (updatedCart: SavedCart) => {
    setCart(updatedCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("dayPassCart", JSON.stringify(updatedCart));
      // Dispatch custom event to update header
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) return;

    const quantityDiff = quantity - item.quantity;
    const updatedItems = cart.items.map((i) =>
      i.id === itemId ? { ...i, quantity } : i,
    );

    const updatedCart = {
      ...cart,
      items: updatedItems,
      totalAmount: cart.totalAmount + item.price * quantityDiff,
    };

    saveCart(updatedCart);
  };

  const removeItem = (itemId: string) => {
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) return;

    const updatedCart = {
      ...cart,
      items: cart.items.filter((i) => i.id !== itemId),
      totalAmount: cart.totalAmount - item.price * item.quantity,
    };

    saveCart(updatedCart);
  };

  const setVisitDate = (date: string) => {
    const updatedCart = {
      ...cart,
      visitDate: date,
    };
    saveCart(updatedCart);
  };

  const handleProceedToCheckout = () => {
    if (cart.items.length === 0) {
      alert("Please add items to your cart");
      return;
    }

    if (!cart.visitDate) {
      alert("Please select a visit date");
      return;
    }

    // Check if cart has at least one valid ticket (any ticket except Infant alone)
    // Valid tickets: Items with "Ticket" in the name, excluding Infant Ticket
    const hasValidTicket = cart.items.some(
      (item) => item.name.includes("Ticket") && !item.name.includes("Infant"),
    );

    if (!hasValidTicket) {
      alert(
        "You must select at least one ticket (Day Pass or Premium ticket) before checkout. Add-on experiences alone cannot be booked. Please select a ticket type first.",
      );
      return;
    }

    // Check if only infant tickets in cart
    const hasOnlyInfant = cart.items.every((item) =>
      item.name.includes("Infant Ticket"),
    );
    if (hasOnlyInfant) {
      alert(
        "Infant tickets cannot be booked alone. Please add at least one ticketed guest (Kids, Teens, or Adult).",
      );
      return;
    }

    // Check if cart has infant tickets but no pay-per-guest tickets
    const hasInfant = cart.items.some((item) =>
      item.name.includes("Infant Ticket"),
    );
    if (hasInfant && !hasValidTicket) {
      alert(
        "Infant tickets must be accompanied by at least one ticketed guest (Kids, Teens, or Adult).",
      );
      return;
    }

    // Redirect to checkout page
    router.push("/day-pass/checkout");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-blue-900 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Products</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        {cart.items.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push("/day-pass")}
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Items</h2>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        ₦{item.price.toLocaleString()} each
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-200 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-200 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-right min-w-24 font-bold text-gray-900">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visit Date */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                When would you like to visit?
              </h2>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-900" />
                <input
                  type="date"
                  value={cart.visitDate || ""}
                  onChange={(e) => setVisitDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-900 focus:outline-none"
                />
              </div>
              {cart.visitDate && (
                <p className="text-sm text-gray-600 mt-2">
                  Visit date:{" "}
                  {format(new Date(cart.visitDate), "EEEE, MMMM d, yyyy")}
                </p>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-blue-200">
                <span className="text-gray-600">
                  Subtotal (
                  {cart.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items)
                </span>
                <span className="font-semibold text-gray-900">
                  ₦{cart.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-semibold text-gray-900">₦0</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-blue-200">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold text-blue-700">
                  ₦{cart.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={cart.items.length === 0 || !cart.visitDate}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors text-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
