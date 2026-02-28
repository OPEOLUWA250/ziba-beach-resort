import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase/client";

const SALT_ROUNDS = 10;

interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  currency?: string;
}

export async function registerUser(input: RegisterInput) {
  try {
    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    const userId = `user-${Date.now()}`;

    const { data, error } = await supabase.from("users").insert({
      id: userId,
      email: input.email,
      firstName: input.firstName || "",
      lastName: input.lastName || "",
      phone: input.phone || null,
      country: input.country || null,
      currency: input.currency || "NGN",
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase registration error:", error);
      throw new Error(error.message);
    }

    return {
      id: userId,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      currency: input.currency || "NGN",
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      throw new Error("User not found");
    }

    if (!data.passwordHash) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, data.passwordHash);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    return {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      token: "session-token",
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found error
        return null;
      }
      console.error("Supabase error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<RegisterInput>,
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
