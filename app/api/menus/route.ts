import { NextRequest, NextResponse } from "next/server";
import { getAllMenus, createMenuItem } from "@/lib/services/menus";
import { COMPLETE_MENU_SEED } from "@/lib/menu-seed";
import {
  handleSupabaseError,
  validateRequiredFields,
} from "@/lib/supabase/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const menus = await getAllMenus();

    // If no menus in database, seed with mock data
    if (menus.length === 0) {
      return NextResponse.json({
        categories: COMPLETE_MENU_SEED,
        success: true,
        source: "fallback",
      });
    }

    return NextResponse.json({
      categories: menus,
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
