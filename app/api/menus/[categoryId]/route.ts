import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";

export const dynamic = "force-dynamic";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 12);

// GET all items in a category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const { default: prisma } = await import("@/lib/services/prisma");
    const { categoryId } = await params;

    const items = await prisma.menuItem.findMany({
      where: { categoryId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ items, success: true });
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
    const { name, description, priceNGN } = body;

    if (!name || priceNGN === undefined) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 },
      );
    }

    // For mock mode, just return the created item
    const newItem = {
      id: nanoid(),
      categoryId: (await params).categoryId,
      name,
      description,
      priceNGN: parseFloat(priceNGN),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create menu item" },
      { status: 500 },
    );
  }
}
