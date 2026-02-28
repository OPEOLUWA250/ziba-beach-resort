import { NextRequest, NextResponse } from "next/server";
import { COMPLETE_MENU_SEED } from "@/lib/menu-seed";

export const dynamic = "force-dynamic";

// Use complete menu seed data as fallback
const MOCK_CATEGORIES = COMPLETE_MENU_SEED;

export async function GET(request: NextRequest) {
  try {
    const { default: prisma } = await import("@/lib/services/prisma");

    const categories = await prisma.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
      },
    });

    return NextResponse.json({ categories, success: true, source: "database" });
  } catch (error: any) {
    console.warn(
      "Could not connect to database, using mock data fallback",
      error.message,
    );

    // Return mock data as fallback
    return NextResponse.json({
      categories: MOCK_CATEGORIES,
      success: true,
      source: "mock",
      message: "Using mock data - database not available",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { default: prisma } = await import("@/lib/services/prisma");
    const body = await request.json();
    const { name, description, timing, note } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 },
      );
    }

    const category = await prisma.menuCategory.create({
      data: {
        name,
        description,
        timing,
        note,
        isActive: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("Error creating menu category:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create menu category" },
      { status: 500 },
    );
  }
}
