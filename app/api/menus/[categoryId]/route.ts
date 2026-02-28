import { NextRequest, NextResponse } from "next/server";
import { getMenusByCategory, createMenuItem } from "@/lib/services/menus";
import {
  handleSupabaseError,
  validateRequiredFields,
} from "@/lib/supabase/utils";

export const dynamic = "force-dynamic";

// GET all items in a category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const { categoryId } = await params;

    // Map categoryId to category name (for now, categoryId is the category name)
    const items = await getMenusByCategory(categoryId);

    return NextResponse.json({
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        priceNGN: item.price,
        isActive: item.available !== false,
      })),
      success: true,
    });
  } catch (error: any) {
    console.warn(
      "Could not fetch from database, returning empty",
      error.message,
    );
    return NextResponse.json({ items: [], success: true, source: "mock" });
  }
}

// POST new item to a category
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const body = await request.json();
    const { categoryId } = await params;
    const { name, description, priceNGN, categoryName } = body;

    const { valid, missingFields } = validateRequiredFields(body, [
      "name",
      "priceNGN",
    ]);

    if (!valid) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    // Use categoryName if provided, otherwise use categoryId
    const category = categoryName || categoryId;

    const newItem = await createMenuItem({
      categoryId,
      itemId: `item-${Date.now()}`,
      category,
      name,
      description: description || "",
      price: priceNGN,
      image: body.image,
      available: body.isActive !== false,
    });

    // Map database fields to API response format
    const responseItem = {
      id: newItem.id,
      name: newItem.name,
      description: newItem.description || "",
      priceNGN: newItem.price !== undefined ? newItem.price : priceNGN,
      isActive: newItem.available !== false,
    };

    return NextResponse.json(responseItem, { status: 201 });
  } catch (error: any) {
    console.error("Error creating menu item:", error);
    const { message, statusCode } = handleSupabaseError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
