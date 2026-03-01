import { supabase } from "@/lib/supabase/client";

export interface PopupData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  modal_cta_text?: string;
  dedicated_page_cta_text?: string;
  dedicated_page_cta_url?: string;
  tags?: string[];
  status?: string;
}

// Get all active popups (for homepage display)
export async function getActivePopups(): Promise<PopupData[]> {
  try {
    const { data, error } = await supabase
      .from("popups")
      .select("*")
      .eq("status", "ACTIVE")
      .order("createdat", { ascending: false });

    if (error) {
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching active popups:", error);
    return [];
  }
}

// Get single popup by slug (for details page)
export async function getPopupBySlug(slug: string): Promise<PopupData | null> {
  try {
    const { data, error } = await supabase
      .from("popups")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching popup by slug:", error);
    return null;
  }
}

// Get popup by ID
export async function getPopupById(id: string): Promise<PopupData | null> {
  try {
    const { data, error } = await supabase
      .from("popups")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching popup by ID:", error);
    return null;
  }
}

// Get all popups (admin view - including inactive)
export async function getAllPopups(): Promise<PopupData[]> {
  try {
    const { data, error } = await supabase
      .from("popups")
      .select("*")
      .order("createdat", { ascending: false });

    if (error) {
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching all popups:", error);
    return [];
  }
}

// Create popup
export async function createPopup(popup: PopupData): Promise<PopupData | null> {
  try {
    const { data, error } = await supabase
      .from("popups")
      .insert([popup])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating popup:", error);
    throw error;
  }
}

// Update popup by ID or slug
export async function updatePopup(
  idOrSlug: string,
  updates: Partial<PopupData>,
): Promise<PopupData | null> {
  try {
    const { data, error } = await supabase
      .from("popups")
      .update(updates)
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating popup:", error);
    throw error;
  }
}

// Delete popup by ID or slug
export async function deletePopup(idOrSlug: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("popups")
      .delete()
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting popup:", error);
    throw error;
  }
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
