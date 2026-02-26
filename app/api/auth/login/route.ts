import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/services/auth";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await loginUser(email, password);

    // In production, set JWT token in httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 },
    );

    // Optional: Set token in cookie (implement your JWT token generation)
    // response.cookies.set('auth-token', token, { httpOnly: true, secure: true });

    return response;
  } catch (error: any) {
    console.error("Error logging in user:", error);

    if (error.message.includes("Invalid email or password")) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 },
    );
  }
}
