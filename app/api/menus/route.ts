import { NextRequest, NextResponse } from "next/server";
import { getAllMenus, createMenuItem } from "@/lib/services/menus";
import { COMPLETE_MENU_SEED } from "@/lib/menu-seed";
import {
  handleSupabaseError,
  validateRequiredFields,
} from "@/lib/supabase/utils";

export const dynamic = "force-dynamic";

interface MenuCategory {
  id: string;
  name: string;
  timing: string;
  note: string;
  isActive: boolean;
  items: any[];
}

export async function GET(request: NextRequest) {
  try {
    const menus = await getAllMenus();

    // If no menus in database, use fallback
    if (menus.length === 0) {
      return NextResponse.json({
        categories: COMPLETE_MENU_SEED,
        success: true,
        source: "fallback",
      });
    }

    // Transform flat menu structure into categorized structure
    const categoriesMap = new Map<string, MenuCategory>();

    menus.forEach((menu) => {
      // Use slugified category name as consistent ID
      const categorySlug = menu.category.toLowerCase().replace(/\s+/g, "-");

      if (!categoriesMap.has(categorySlug)) {
        categoriesMap.set(categorySlug, {
          id: categorySlug,
          name: menu.category,
          timing: "", // Could be added to schema if needed
          note: "", // Could be added to schema if needed
          isActive: menu.available !== false,
          items: [],
        });
      }

      const category = categoriesMap.get(categorySlug);
      if (category) {
        category.items.push({
          id: menu.id,
          name: menu.name,
          description: menu.description || "",
          priceNGN: menu.price,
          isActive: menu.available !== false,
        });
      }
    });

    const categories = Array.from(categoriesMap.values());

    return NextResponse.json({
      categories,
      success: true,
      source: "database",
    });
  } catch (error: any) {
    console.warn("Error loading menu data", error.message);

    // Fallback to mock data
    return NextResponse.json(
      { categories: COMPLETE_MENU_SEED, success: true, source: "fallback" },
      { status: 200 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { valid, missingFields } = validateRequiredFields(body, [
      "category",
      "name",
      "price",
    ]);

    if (!valid) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    const menuItem = await createMenuItem({
      categoryId: body.categoryId || `cat-${Date.now()}`,
      itemId: body.itemId || `item-${Date.now()}`,
      category: body.category,
      name: body.name,
      description: body.description,
      price: body.price,
      image: body.image,
      available: body.available !== false,
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error: any) {
    console.error("Error creating menu item:", error);
    const { message, statusCode } = handleSupabaseError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
