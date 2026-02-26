"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState } from "react";
import { Plus, Minus, X, ShoppingCart } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function DayPass() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const products = [
    {
      id: "infant-ticket",
      name: "Infant Ticket",
      price: 0,
      category: "tickets",
    },
    {
      id: "kids-ticket",
      name: "Kids Ticket",
      price: 10000,
      category: "tickets",
    },
    {
      id: "kids-plus",
      name: "Kids Ticket Plus",
      price: 25000,
      category: "tickets",
    },
    {
      id: "teens-ticket",
      name: "Teens Ticket",
      price: 15000,
      category: "tickets",
    },
    {
      id: "teens-plus",
      name: "Teens Ticket Plus",
      price: 30000,
      category: "tickets",
    },
    {
      id: "adult-ticket",
      name: "Adult Ticket",
      price: 20000,
      category: "tickets",
    },
    {
      id: "adult-plus",
      name: "Adult Ticket Plus",
      price: 35000,
      category: "tickets",
    },
    {
      id: "deep-massage",
      name: "Deep Tissue Massage",
      price: 35000,
      category: "experiences",
    },
    {
      id: "swedish-massage",
      name: "Swedish Massage",
      price: 25000,
      category: "experiences",
    },
    {
      id: "kids-massage",
      name: "Kids Massage",
      price: 11250,
      category: "experiences",
    },
    {
      id: "horse-riding",
      name: "Horse riding",
      price: 5062,
      category: "experiences",
    },
    {
      id: "paint-pool",
      name: "Paint & Chill in the pool with floating snacks [For 2]",
      price: 50000,
      category: "experiences",
    },
    {
      id: "paint-canvas",
      name: "Paint & Chill with Canvas",
      price: 15000,
      category: "experiences",
    },
    {
      id: "family-lunch",
      name: "Family/Group Beachside Lunch",
      price: 22500,
      category: "experiences",
    },
    {
      id: "beachfront-picnic",
      name: "Beachfront Picnic",
      price: 28125,
      category: "experiences",
    },
    {
      id: "paint-tote",
      name: "Paint & Chill with Tote Bag",
      price: 13000,
      category: "experiences",
    },
    {
      id: "paint-kids",
      name: "Paint & Chill for Children",
      price: 10000,
      category: "experiences",
    },
  ];

  const [cart, setCart] = useState<Record<string, number>>({});

  const updateQuantity = (productId: string, change: number) => {
    setCart((prev) => {
      const newQty = Math.max(0, (prev[productId] || 0) + change);
      if (newQty === 0) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const getQuantity = (productId: string) => cart[productId] || 0;

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [productId, qty]) => {
      const product = products.find((p) => p.id === productId);
      return total + (product ? product.price * qty : 0);
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const ticketProducts = products.filter((p) => p.category === "tickets");
  const experienceProducts = products.filter(
    (p) => p.category === "experiences",
  );

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* HERO SECTION */}
        <section className="relative w-full h-screen bg-gray-900 overflow-hidden flex items-center py-20">
          <div className="absolute inset-0">
            <img
              src="/Ziba-hero.jpg"
              alt="Day Pass Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Day Pass
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 font-light mb-8">
                Spend 8 hours by the beach with us at Ziba
              </p>
              <p className="text-base sm:text-lg text-gray-200 font-light mb-10">
                Available daily • 10:00am – 6:00pm
              </p>
              <div className="w-24 h-1 bg-white mx-auto"></div>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="text-white text-center">
              <p className="text-sm font-light mb-2">Explore More</p>
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* PRODUCTS SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* TICKETS SECTION */}
            <div className="mb-20">
              <h2
                className="text-4xl font-light text-gray-900 mb-12"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Day Pass Tickets
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
                {ticketProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={getQuantity(product.id)}
                    onIncrease={() => updateQuantity(product.id, 1)}
                    onDecrease={() => updateQuantity(product.id, -1)}
                  />
                ))}
              </div>
            </div>

            {/* EXPERIENCES SECTION */}
            <div className="mb-20">
              <h2
                className="text-4xl font-light text-gray-900 mb-12"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Add-On Experiences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {experienceProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={getQuantity(product.id)}
                    onIncrease={() => updateQuantity(product.id, 1)}
                    onDecrease={() => updateQuantity(product.id, -1)}
                  />
                ))}
              </div>
            </div>

            {/* ORDER SUMMARY - FLOATING BUTTON */}
            {Object.keys(cart).length > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-900 text-white rounded-xl shadow-2xl hover:shadow-lg hover:bg-blue-800 transition-all duration-300 z-40 flex items-center gap-3 px-6 py-4"
              >
                <ShoppingCart size={24} />
                <div className="text-left">
                  <p className="text-sm font-light">
                    {Object.keys(cart).length} items
                  </p>
                  <p className="font-semibold">
                    {formatCurrency(calculateTotal())}
                  </p>
                </div>
              </button>
            )}

            {/* CART DRAWER */}
            {isCartOpen && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
                  onClick={() => setIsCartOpen(false)}
                />

                {/* Drawer */}
                <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                      <h3
                        className="text-3xl font-light text-gray-900"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        Order Summary
                      </h3>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X size={24} className="text-gray-900" />
                      </button>
                    </div>

                    {/* Items */}
                    {Object.keys(cart).length === 0 ? (
                      <p className="text-gray-600 font-light mb-8">
                        No items selected
                      </p>
                    ) : (
                      <div className="mb-8 space-y-3 max-h-96 overflow-y-auto">
                        {Object.entries(cart).map(([productId, qty]) => {
                          const product = products.find(
                            (p) => p.id === productId,
                          );
                          if (!product) return null;
                          return (
                            <div
                              key={productId}
                              className="flex justify-between items-center pb-3 border-b border-gray-200"
                            >
                              <div className="flex-1">
                                <p className="font-light text-gray-900 text-sm">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-600 font-light">
                                  {qty} × {formatCurrency(product.price)}
                                </p>
                              </div>
                              <p className="font-light text-gray-900 text-sm">
                                {formatCurrency(product.price * qty)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t-2 border-gray-900 pt-4 mb-8">
                      <div className="flex justify-between items-center">
                        <h4
                          className="text-2xl font-light text-gray-900"
                          style={{ fontFamily: "Cormorant Garamond, serif" }}
                        >
                          Total
                        </h4>
                        <p className="text-3xl font-light text-gray-900">
                          {formatCurrency(calculateTotal())}
                        </p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button className="w-full bg-blue-900 text-white py-4 rounded-lg font-light hover:bg-blue-800 transition-all duration-300 hover:shadow-lg text-lg mb-4">
                      Proceed to Checkout
                    </button>

                    {/* Continue Shopping Button */}
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="w-full border-2 border-blue-900 text-blue-900 py-4 rounded-lg font-light hover:bg-blue-900 hover:text-white transition-all duration-300 text-lg"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

function ProductCard({
  product,
  quantity,
  onIncrease,
  onDecrease,
}: ProductCardProps) {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
      <h4 className="font-light text-gray-900 mb-3 min-h-12 flex items-center">
        {product.name}
      </h4>

      <p className="text-3xl font-light text-gray-900 mb-6">
        ₦{product.price.toLocaleString()}
      </p>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 font-light">Quantity</span>
        <div className="flex items-center gap-3 border-2 border-gray-300 rounded-lg">
          <button
            onClick={onDecrease}
            disabled={quantity === 0}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={20} className="text-gray-900" />
          </button>
          <span className="w-12 text-center font-light text-gray-900 text-lg">
            {quantity}
          </span>
          <button
            onClick={onIncrease}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <Plus size={20} className="text-gray-900" />
          </button>
        </div>
      </div>
    </div>
  );
}
