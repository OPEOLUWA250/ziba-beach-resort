import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/services/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status") || "AVAILABLE";

    const rooms = await prisma.room.findMany({
      where: {
        status,
      },
      skip: offset,
      take: limit,
    });

    const total = await prisma.room.count({
      where: { status },
    });

    return NextResponse.json({
      total,
      limit,
      offset,
      rooms,
    });
  } catch (error: any) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch rooms" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priceNGN, capacity, amenities, images } = body;

    if (!title || !priceNGN || !capacity) {
      return NextResponse.json(
        { error: "Missing required fields: title, priceNGN, capacity" },
        { status: 400 },
      );
    }

    const room = await prisma.room.create({
      data: {
        title,
        description,
        priceNGN,
        capacity,
        amenities: amenities || [],
        images: images || [],
        status: "AVAILABLE",
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error: any) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create room" },
      { status: 500 },
    );
  }
}
