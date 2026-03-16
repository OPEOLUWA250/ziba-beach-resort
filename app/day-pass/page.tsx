"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  age_group?: string;
}

export default function DayPass() {
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/day-pass/experiences");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();

        // Map database fields to product format
        const mappedProducts = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price_per_person,
          category:
            item.name.toLowerCase().includes("massage") ||
            item.name.toLowerCase().includes("paint") ||
            item.name.toLowerCase().includes("horse") ||
            item.name.toLowerCase().includes("lunch") ||
            item.name.toLowerCase().includes("picnic")
              ? "experiences"
              : "tickets",
          description: item.description || "Description coming soon.",
          age_group: item.age_group,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      if (typeof window !== "undefined") {
        // Check if an order was just completed
        const lastOrderCompleted = localStorage.getItem("lastOrderCompleted");
        if (lastOrderCompleted) {
          // Clear the flag and ensure cart is empty
          localStorage.removeItem("lastOrderCompleted");
          localStorage.removeItem("dayPassCart");
          setCart({});
          return;
        }

        const savedCart = localStorage.getItem("dayPassCart");
        if (savedCart) {
          try {
            const parsed = JSON.parse(savedCart);
            // Convert items back to the local cart format
            const localCart: Record<string, number> = {};
            if (parsed.items && Array.isArray(parsed.items)) {
              parsed.items.forEach((item: CartItem) => {
                localCart[item.id] = item.quantity;
              });
            }
            setCart(localCart);
          } catch (err) {
            console.error("Failed to load cart:", err);
          }
        } else {
          // Cart cleared (payment completed or emptied)
          setCart({});
        }
      }
    };

    loadCart();

    // Also listen for cart updates (e.g., when cart is cleared after payment)
    window.addEventListener("cart-updated", loadCart);
    return () => window.removeEventListener("cart-updated", loadCart);
  }, []);

  const saveCartToLocalStorage = (cartData: Record<string, number>) => {
    if (typeof window === "undefined") return;

    const items = Object.entries(cartData).map(([productId, qty]) => {
      const product = products.find((p) => p.id === productId);
      return {
        id: productId,
        name: product?.name || productId,
        price: product?.price || 0,
        quantity: qty,
      };
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const cartToSave = {
      items,
      visitDate: null,
      totalAmount,
    };

    localStorage.setItem("dayPassCart", JSON.stringify(cartToSave));
    // Dispatch event asynchronously to avoid React state update in render warning
    setTimeout(() => {
      window.dispatchEvent(new Event("cart-updated"));
    }, 0);
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart((prev) => {
      const newQty = Math.max(0, (prev[productId] || 0) + change);
      let updated;
      if (newQty === 0) {
        updated = { ...prev };
        delete updated[productId];
      } else {
        updated = { ...prev, [productId]: newQty };
      }
      saveCartToLocalStorage(updated);
      return updated;
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
  const regularTickets = ticketProducts.filter((p) => !p.name.includes("Plus"));
  const plusTickets = ticketProducts.filter((p) => p.name.includes("Plus"));
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
              src="/day-experience.jpg"
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
        <section className="px-4 sm:px-6 lg:px-8 py-28 bg-white">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
                <p className="text-gray-600">Loading experiences...</p>
              </div>
            ) : (
              <>
                {/* REGULAR TICKETS SECTION */}
                <div className="mb-20" id="regular-tickets">
                  <h2 className="h2 text-blue-900 mb-12">Day Pass Tickets</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
                    {regularTickets.map((product) => (
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

                {/* PREMIUM PLUS TICKETS SECTION */}
                {plusTickets.length > 0 && (
                  <div className="mb-20" id="premium-tickets">
                    <div className="mb-12">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="h2 text-blue-900">Premium Tickets</h2>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 text-xs font-semibold rounded-full">
                          PLUS BENEFITS
                        </span>
                      </div>
                      <p className="text-gray-600 font-light mb-6">
                        Upgrade your day pass with complimentary meals and
                        premium experiences
                      </p>
                      <a
                        href="/menu#ticket-plus-meals"
                        className="inline-block bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium py-2.5 px-6 rounded-lg transition-colors"
                      >
                        View Meal Options
                      </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {plusTickets.map((product) => (
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
                )}

                {/* EXPERIENCES SECTION */}
                <div className="mb-20">
                  <h2 className="h2 text-blue-900 mb-12">Add-On Experiences</h2>

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
              </>
            )}

            {/* ORDER SUMMARY - REMOVED - Use header cart icon instead */}
          </div>
        </section>

        {/* WHAT YOUR DAY PASS COVERS */}
        <section className="px-4 sm:px-6 lg:px-8 py-28 bg-linear-to-br from-blue-50 via-white to-pink-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-5xl font-light text-blue-900 mb-4 text-center"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                What Your Day Pass Covers
              </h2>
              <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                {
                  icon: "🚪",
                  title: "Entrance",
                  description: "Full resort access",
                },
                {
                  icon: "🎬",
                  title: "3pm Movie in Cinema",
                  description: "Daily screening",
                },
                {
                  icon: "🏊",
                  title: "Swimming Pool",
                  description: "General pool access",
                },
                {
                  icon: "🎪",
                  title: "Children's Playground",
                  description: "Fun for kids",
                },
                {
                  icon: "🔥",
                  title: "Fire Pit",
                  description: "Evening relaxation",
                },
                {
                  icon: "🎮",
                  title: "Games Room",
                  description: "Indoor entertainment",
                },
                {
                  icon: "☀️",
                  title: "Pool Cabanas",
                  description: "Shaded comfort",
                },
                {
                  icon: "🏖️",
                  title: "Beachfront Access",
                  description: "Direct beach entry",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-light">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Important Policies & Guidelines */}
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
              <h3
                className="text-3xl font-light text-blue-900 mb-6 text-center"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Important Policies & Guidelines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "No outside food & beverage allowed",
                  "One pass required per guest",
                  "No pets allowed",
                  "Only general pool access included. Overwater pool excluded",
                  "Time Access: 10am - 6:00pm strictly. Exit by 6:30pm",
                  "Subject to availability & blackout dates may apply",
                ].map((policy, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-green-600 text-xl mt-0.5">✓</span>
                    <p className="text-gray-700 font-light flex-1">{policy}</p>
                  </div>
                ))}
              </div>
            </div>
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
    description?: string;
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
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col h-full p-7">
      {/* Title */}
      <h4 className="text-gray-900 mb-3 text-lg font-medium">
        {product.name}
      </h4>

      {/* Description */}
      <p className="text-sm text-gray-600 font-light mb-6 grow">
        {product.description || "A premium experience at Ziba Beach Resort."}
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-gray-200 mb-6"></div>

      {/* Price */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 font-light uppercase tracking-wider mb-1">
          Price per person
        </p>
        <p className="text-2xl font-light text-gray-900">
          ₦{product.price.toLocaleString()}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-gray-600 font-light uppercase tracking-wider">
          Qty
        </span>
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
          <button
            onClick={onDecrease}
            disabled={quantity === 0}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={16} className="text-gray-900" />
          </button>
          <span className="w-8 text-center font-light text-gray-900 text-sm">
            {quantity}
          </span>
          <button
            onClick={onIncrease}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <Plus size={16} className="text-gray-900" />
          </button>
        </div>
      </div>
    </div>
  );
}
