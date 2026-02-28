import { supabase } from "@/lib/supabase/client";

export async function getAllMenus() {
  try {
    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .eq("available", true)
      .order("category", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching menus:", error);
    return [];
  }
}

export async function getMenusByCategory(category: string) {
  try {
    // Handle both slugified and regular category names
    // If it's slugified (lowercase with hyphens), convert back to proper case
    const categoryName = category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .ilike("category", categoryName)
      .eq("available", true);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching menus by category:", error);
    return [];
  }
}

export async function getMenuItemById(itemId: string) {
  try {
    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .eq("id", itemId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return null;
  }
}

export async function createMenuItem(menuData: {
  categoryId: string;
  itemId: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  available?: boolean;
}) {
  try {
    const id = `menu-${Date.now()}`;

    const insertData = {
      id,
      categoryid: menuData.categoryId,
      itemid: menuData.itemId,
      category: menuData.category,
      name: menuData.name,
      description: menuData.description || null,
      price: menuData.price,
      image: menuData.image || null,
      available: menuData.available !== false,
    };

    const { error } = await supabase.from("menus").insert([insertData]);

    if (error) throw error;

    // Return the item we just inserted (no .select() to avoid schema cache issues)
    return {
      id: insertData.id,
      name: insertData.name,
      description: insertData.description || "",
      price: insertData.price,
      available: insertData.available,
    };
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw error;
  }
}

export async function updateMenuItem(
  menuId: string,
  updates: Partial<{
    name: string;
    description: string;
    price: number;
    image: string;
    available: boolean;
  }>,
) {
  try {
    const { error } = await supabase
      .from("menus")
      .update(updates)
      .eq("id", menuId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
}

export async function deleteMenuItem(menuId: string) {
  try {
    const { error } = await supabase.from("menus").delete().eq("id", menuId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
}

export async function getMenuCategories() {
  try {
    const { data, error } = await supabase
      .from("menus")
      .select("category")
      .eq("available", true);

    if (error) throw error;

    const categories = data?.map((item: any) => item.category) || [];
    return Array.from(new Set(categories));
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    return [];
  }
}
export async function getAllMenusForAdmin() {
  try {
    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .order("category", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching menus for admin:", error);
    return [];
  }
}
