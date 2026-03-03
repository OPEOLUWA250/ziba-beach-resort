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

export default function DayPass() {
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});

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
                    Upgrade your day pass with complimentary meals and premium
                    experiences
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

            {/* ORDER SUMMARY - REMOVED - Use header cart icon instead */}

            {/* Next section content */}
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
    <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <h4 className="font-light text-gray-900 mb-3 min-h-12 flex items-center">
        {product.name}
      </h4>

      <p className="text-3xl font-light text-gray-900 mb-6">
        ₦{product.price.toLocaleString()}
      </p>

      <div className="flex items-center gap-4 mt-auto">
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
