"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Baby,
  Check,
  Clapperboard,
  DoorOpen,
  Flame,
  Gamepad2,
  Gift,
  Minus,
  Plus,
  ShoppingBag,
  Umbrella,
  Waves,
  Sun,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import PageHero from "@/components/page-hero";
import SectionHeading from "@/components/section-heading";
import { whatsappLink } from "@/lib/booking-links";
import { RESORT } from "@/lib/site";
import { addOnImage } from "@/lib/day-pass-images";
import { track } from "@/lib/analytics";

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
  const [cart, setCart] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

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
        if (!Array.isArray(data) || data.length === 0) setLoadError(true);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoadError(true);
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
    if (change > 0) {
      track("daypass_add_to_cart", {
        item: products.find((p) => p.id === productId)?.name || productId,
      });
    }
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

  const ticketProducts = products.filter((p) => p.category === "tickets");
  const regularTickets = ticketProducts.filter((p) => !p.name.includes("Plus"));
  const plusTickets = ticketProducts.filter((p) => p.name.includes("Plus"));
  const experienceProducts = products.filter(
    (p) => p.category === "experiences",
  );

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
    .filter((i) => i.product && i.qty > 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + (i.product?.price || 0) * i.qty, 0);
  // Lets the floating WhatsApp button sit above the cart bar.
  useEffect(() => {
    document.body.toggleAttribute("data-bottom-bar", cartCount > 0);
    return () => document.body.removeAttribute("data-bottom-bar");
  }, [cartCount]);

  const fromPrice = ticketProducts.length
    ? Math.min(...ticketProducts.map((p) => p.price).filter((p) => p > 0))
    : null;

  const COVERS = [
    { icon: DoorOpen, title: "Entrance", text: "Access to the resort for the day" },
    { icon: Waves, title: "Swimming pool", text: "General pool access" },
    { icon: Sun, title: "The beach", text: "Direct beach access" },
    { icon: Umbrella, title: "Pool cabanas", text: "Shade by the pool" },
    { icon: Clapperboard, title: "3pm cinema", text: "A film screening every day" },
    { icon: Gamepad2, title: "Games room", text: "Indoor games" },
    { icon: Baby, title: "Children's playground", text: "For younger guests" },
    { icon: Flame, title: "Firepit", text: "As the evening cools" },
  ];

  const RULES = [
    "One pass per guest",
    "No outside food or drinks",
    "No pets",
    "General pools only: the overwater pool is for room guests",
    "10am–6pm, and please leave by 6:30pm",
    "Subject to availability; blackout dates may apply",
  ];

  return (
    <>
      <Header />
      <main className="bg-white">
        <PageHero
          eyebrow="Day pass"
          title="A day by the sea"
          subtitle="Eight hours of pools, beach, food and fun at Ziba, every day from 10am to 6pm."
          imageUrl="/day-experience.jpg"
          imageAlt="Guests on the beach at Ziba"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#tickets"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-blue-950 transition hover:bg-blue-50"
            >
              Choose tickets
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            {fromPrice && (
              <p className="text-sm font-light text-white/90">
                From ₦{fromPrice.toLocaleString("en-NG")} per adult
              </p>
            )}
          </div>
        </PageHero>

        {/* TICKETS & ADD-ONS */}
        <section id="tickets" className="scroll-mt-28 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-7xl space-y-20">
            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading tickets">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="h-64 animate-pulse rounded-3xl bg-slate-100" />
                ))}
              </div>
            ) : loadError || products.length === 0 ? (
              <div className="mx-auto max-w-2xl rounded-3xl bg-[#f7f4ee] px-6 py-12 text-center sm:px-12">
                <h2 className="font-cormorant text-4xl font-medium text-blue-950">
                  We can&apos;t show tickets right now
                </h2>
                <p className="mt-4 font-light leading-relaxed text-slate-600">
                  Please try again in a few minutes, or book your day pass with
                  us directly. We&apos;re happy to help.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a
                    href={whatsappLink("Hello Ziba, I'd like to book a day pass.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("whatsapp_click", { context: "day_pass_unavailable" })}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-950 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-900"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
                    Book on WhatsApp
                  </a>
                  <a
                    href={`tel:${RESORT.phones[0].replace(/\s/g, "")}`}
                    onClick={() => track("phone_click", { context: "day_pass_unavailable" })}
                    className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-900 hover:border-blue-950"
                  >
                    Call {RESORT.phones[0]}
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div id="regular-tickets" className="scroll-mt-28">
                  <SectionHeading align="left" eyebrow="Tickets" title="Day pass tickets">
                    Access to the pools, beach and facilities from 10am to 6pm.
                    Infants come free.
                  </SectionHeading>
                  <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

                {plusTickets.length > 0 && (
                  <div id="premium-tickets" className="scroll-mt-28">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <SectionHeading align="left" eyebrow="Plus tickets" title="With a meal and a drink">
                        Everything in a day pass, plus one meal and a drink
                        (cocktail, mocktail, soft drink or beer).
                      </SectionHeading>
                      <Link
                        href="/menu#daypass-menu"
                        className="shrink-0 text-sm font-semibold text-blue-900 underline-offset-4 hover:underline"
                      >
                        See the meal options
                      </Link>
                    </div>
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

                {experienceProducts.length > 0 && (
                  <div>
                    <SectionHeading align="left" eyebrow="Add-ons" title="Make a day of it">
                      Add an experience to your visit.
                    </SectionHeading>
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {experienceProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          image={addOnImage(product.name)}
                          product={product}
                          quantity={getQuantity(product.id)}
                          onIncrease={() => updateQuantity(product.id, 1)}
                          onDecrease={() => updateQuantity(product.id, -1)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  href="/gift"
                  className="group flex items-center justify-between gap-6 rounded-3xl border border-slate-200 px-6 py-6 transition hover:border-blue-900 sm:px-8"
                >
                  <span className="flex items-center gap-4">
                    <Gift className="h-6 w-6 text-blue-800" strokeWidth={1.5} aria-hidden="true" />
                    <span>
                      <span className="block font-medium text-slate-900">Buying for someone else?</span>
                      <span className="block text-sm font-light text-slate-600">
                        Gift a day pass with a personal message.
                      </span>
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-blue-900 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </>
            )}
          </div>
        </section>

        {/* WHAT YOUR DAY PASS COVERS */}
        <section className="bg-[#f7f4ee] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Included" title="What your day pass covers" />
            <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
              {COVERS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white">
                    <Icon className="h-6 w-6 text-blue-800" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-medium text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm font-light text-slate-600">{text}</p>
                </li>
              ))}
            </ul>

            <div className="mx-auto mt-16 max-w-4xl rounded-3xl bg-white p-8 sm:p-10">
              <h3 className="font-cormorant text-3xl font-medium text-blue-950">Good to know</h3>
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {RULES.map((rule) => (
                  <li key={rule} className="flex gap-3 text-[15px] font-light text-slate-700">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-blue-800" strokeWidth={2} aria-hidden="true" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Cart summary, once something is in it */}
      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
            <p className="flex items-center gap-3 text-sm text-slate-700">
              <ShoppingBag className="h-5 w-5 text-blue-900" strokeWidth={1.5} aria-hidden="true" />
              <span>
                {cartCount} {cartCount === 1 ? "item" : "items"} ·{" "}
                <span className="font-semibold text-slate-900">₦{cartTotal.toLocaleString("en-NG")}</span>
              </span>
            </p>
            <Link
              href="/day-pass/cart"
              className="inline-flex items-center gap-2 rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900"
            >
              Review &amp; pay
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
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
    age_group?: string;
  };
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  /** Add-ons show a photo of the experience. */
  image?: string;
}

function ProductCard({ product, quantity, onIncrease, onDecrease, image }: ProductCardProps) {
  const selected = quantity > 0;
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-3xl border transition ${
        selected ? "border-blue-900 bg-blue-50/40" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {image && (
        <div className="relative aspect-[4/3] bg-slate-100">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          {selected && (
            <span className="absolute left-4 top-4 rounded-full bg-blue-950 px-3 py-1 text-xs font-semibold text-white">
              {quantity} added
            </span>
          )}
        </div>
      )}
      <div className="flex grow flex-col p-7">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-medium text-slate-900">{product.name}</h3>
        {product.age_group && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-light text-slate-600">
            {product.age_group}
          </span>
        )}
      </div>
      {product.description && product.description !== "Description coming soon." && (
        <p className="mt-3 grow text-sm font-light leading-relaxed text-slate-600">{product.description}</p>
      )}
      <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-200 pt-5">
        <div>
          <p className="font-cormorant text-3xl font-medium text-blue-950">
            {product.price > 0 ? `₦${product.price.toLocaleString("en-NG")}` : "Free"}
          </p>
          <p className="text-xs font-light text-slate-500">per person</p>
        </div>
        <div className="flex items-center rounded-full border border-slate-300">
          <button
            type="button"
            onClick={onDecrease}
            disabled={quantity === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100 disabled:opacity-30"
            aria-label={`One fewer ${product.name}`}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="w-8 text-center text-sm font-medium text-slate-900" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
            aria-label={`Add one ${product.name}`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
