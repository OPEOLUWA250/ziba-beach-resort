import { useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface DayPassCart {
  items: CartItem[];
  visitDate: string | null;
  totalAmount: number;
}

export function useCart() {
  const [cart, setCart] = useState<DayPassCart>({
    items: [],
    visitDate: null,
    totalAmount: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
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
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("dayPassCart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addItem = (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
          totalAmount: prev.totalAmount + item.price * item.quantity,
        };
      }
      return {
        ...prev,
        items: [...prev.items, item],
        totalAmount: prev.totalAmount + item.price * item.quantity,
      };
    });
  };

  const removeItem = (itemId: string) => {
    setCart((prev) => {
      const item = prev.items.find((i) => i.id === itemId);
      if (!item) return prev;
      return {
        ...prev,
        items: prev.items.filter((i) => i.id !== itemId),
        totalAmount: prev.totalAmount - item.price * item.quantity,
      };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart((prev) => {
      const item = prev.items.find((i) => i.id === itemId);
      if (!item) return prev;
      const quantityDiff = quantity - item.quantity;
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i,
        ),
        totalAmount: prev.totalAmount + item.price * quantityDiff,
      };
    });
  };

  const setVisitDate = (date: string | null) => {
    setCart((prev) => ({
      ...prev,
      visitDate: date,
    }));
  };

  const clearCart = () => {
    setCart({
      items: [],
      visitDate: null,
      totalAmount: 0,
    });
  };

  const getTotalItems = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    setVisitDate,
    clearCart,
    getTotalItems,
  };
}
