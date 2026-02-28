import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// PUT - Update menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; itemId: string }> },
) {
  try {
    const body = await request.json();
    const { name, description, priceNGN, isActive } = body;
    const { itemId } = await params;

    // For mock mode, return updated item
    const updatedItem = {
      id: itemId,
      categoryId: (await params).categoryId,
      name: name || "Item",
      description: description || "",
      priceNGN: priceNGN !== undefined ? parseFloat(priceNGN) : 0,
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date(),
    };

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error: any) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update menu item" },
      { status: 500 },
    );
  }
}

// DELETE - Remove menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; itemId: string }> },
) {
  try {
    // For mock mode, just return success
    return NextResponse.json({ success: true, message: "Menu item deleted" });
  } catch (error: any) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete menu item" },
      { status: 500 },
    );
  }
}
