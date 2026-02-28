import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Provide fallback values for build time - will use real values at runtime
const url = supabaseUrl || "https://placeholder.supabase.co";
const key = supabaseAnonKey || "placeholder-key";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase environment variables not set. Using placeholder values for build.",
  );
}

// Create a client for browser and client-side API calls
export const supabase = createClient(url, key);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          phone: string | null;
          country: string | null;
          currency: string;
          passwordHash: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          email: string;
          firstName: string;
          lastName?: string;
          phone?: string | null;
          country?: string | null;
          currency?: string;
          passwordHash?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          firstName?: string;
          lastName?: string;
          phone?: string | null;
          country?: string | null;
          currency?: string;
          updatedAt?: string;
        };
      };
      rooms: {
        Row: {
          id: string;
          title: string;
          description: string;
          priceNGN: number;
          capacity: number;
          amenities: string[];
          images: string[];
          status: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          priceNGN: number;
          capacity: number;
          amenities?: string[];
          images?: string[];
          status?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          title?: string;
          description?: string;
          priceNGN?: number;
          capacity?: number;
          amenities?: string[];
          images?: string[];
          status?: string;
          updatedAt?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          userId: string;
          roomId: string;
          checkInDate: string;
          checkOutDate: string;
          numberOfGuests: number;
          specialRequests: string | null;
          status: string;
          totalAmount: number | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          userId: string;
          roomId: string;
          checkInDate: string;
          checkOutDate: string;
          numberOfGuests: number;
          specialRequests?: string | null;
          status?: string;
          totalAmount?: number | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          status?: string;
          totalAmount?: number | null;
          updatedAt?: string;
        };
      };
      blogs: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          featured_image: string | null;
          author: string | null;
          category: string | null;
          read_time: number | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string;
          content: string;
          featured_image?: string | null;
          author?: string | null;
          category?: string | null;
          read_time?: number | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          title?: string;
          excerpt?: string;
          content?: string;
          featured_image?: string | null;
          author?: string | null;
          category?: string | null;
          read_time?: number | null;
          updatedAt?: string;
        };
      };
      menus: {
        Row: {
          id: string;
          categoryId: string;
          itemId: string;
          category: string;
          name: string;
          description: string | null;
          price: number;
          image: string | null;
          available: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          categoryId: string;
          itemId: string;
          category: string;
          name: string;
          description?: string | null;
          price: number;
          image?: string | null;
          available?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          price?: number;
          image?: string | null;
          available?: boolean;
          updatedAt?: string;
        };
      };
    };
  };
};
