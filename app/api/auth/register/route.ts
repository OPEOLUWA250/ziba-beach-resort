import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registerUser } = await import("@/lib/services/auth");
    const { email, password, firstName, lastName, phone, country, currency } =
      body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const user = await registerUser({
      email,
      password,
      firstName,
      lastName,
      phone,
      country,
      currency,
    });

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error registering user:", error);

    if (error.message.includes("already exists")) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to register user" },
      { status: 500 },
    );
  }
}
