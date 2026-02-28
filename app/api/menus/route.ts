import { NextRequest, NextResponse } from "next/server";
import {
  getAllMenus,
  getAllMenusForAdmin,
  createMenuItem,
} from "@/lib/services/menus";
import { COMPLETE_MENU_SEED } from "@/lib/menu-seed";
import { CATEGORY_METADATA } from "@/lib/category-metadata";
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
    // Check if this is an admin request
    const isAdmin = request.nextUrl.searchParams.get("admin") === "true";

    // Fetch menus (all items for admin, only available for public)
    const menus = isAdmin ? await getAllMenusForAdmin() : await getAllMenus();

    console.log("DEBUG: Menus fetched from DB:", menus.length, "items");
    if (menus.length > 0) {
      console.log(
        "DEBUG: First menu item structure:",
        JSON.stringify(menus[0]),
      );
    }

    // Transform flat menu structure into categorized structure
    const categoriesMap = new Map<string, MenuCategory>();

    menus.forEach((menu) => {
      // Use slugified category name as consistent ID
      const categorySlug = menu.category.toLowerCase().replace(/\s+/g, "-");

      if (!categoriesMap.has(categorySlug)) {
        // Get metadata for this category
        const metadata = CATEGORY_METADATA[menu.category] || {
          timing: "",
          note: "",
        };

        categoriesMap.set(categorySlug, {
          id: categorySlug,
          name: menu.category,
          timing: metadata.timing,
          note: metadata.note,
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

    // If no database items but this is public view, use seed data
    if (categories.length === 0 && !isAdmin) {
      return NextResponse.json({
        categories: COMPLETE_MENU_SEED,
        success: true,
        source: "fallback",
      });
    }

    return NextResponse.json({
      categories,
      success: true,
      source: "database",
    });
  } catch (error: any) {
    console.error("Error loading menu data", error.message);

    // If error and this is public view, use seed data
    const isAdmin = request.nextUrl.searchParams.get("admin") === "true";
    if (!isAdmin) {
      return NextResponse.json(
        {
          categories: COMPLETE_MENU_SEED,
          success: true,
          source: "fallback",
        },
        { status: 200 },
      );
    }

    // For admin: return empty on error
    return NextResponse.json(
      {
        categories: [],
        success: true,
        source: "error",
      },
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
