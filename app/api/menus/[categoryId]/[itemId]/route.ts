import { NextRequest, NextResponse } from "next/server";
import {
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/services/menus";
import { handleSupabaseError } from "@/lib/supabase/utils";

export const dynamic = "force-dynamic";

// GET - Retrieve menu item details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; itemId: string }> },
) {
  try {
    const { itemId } = await params;

    const item = await getMenuItemById(itemId);

    if (!item) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        id: item.id,
        name: item.name,
        description: item.description || "",
        priceNGN: item.price,
        isActive: item.available !== false,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching menu item:", error);
    const { message, statusCode } = handleSupabaseError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

// PUT - Update menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; itemId: string }> },
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const { name, description, priceNGN, isActive } = body;

    await updateMenuItem(itemId, {
      name,
      description,
      price: priceNGN,
      available: isActive,
    });

    const updatedItem = {
      id: itemId,
      name: name || "Item",
      description: description || "",
      priceNGN: priceNGN || 0,
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date(),
    };

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error: any) {
    console.error("Error updating menu item:", error);
    const { message, statusCode } = handleSupabaseError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

// DELETE - Remove menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; itemId: string }> },
) {
  try {
    const { itemId } = await params;

    await deleteMenuItem(itemId);

    return NextResponse.json({ success: true, message: "Menu item deleted" });
  } catch (error: any) {
    console.error("Error deleting menu item:", error);
    const { message, statusCode } = handleSupabaseError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
