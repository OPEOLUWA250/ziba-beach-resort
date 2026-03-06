import { NextRequest, NextResponse } from "next/server";
import { rateLimitByIp } from "@/lib/security/rate-limit";
import { userRegisterSchema } from "@/lib/security/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const rate = rateLimitByIp(
      request.headers,
      "api:user:register",
      15,
      60_000,
    );
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        },
      );
    }

    const body = await request.json();
    const { registerUser } = await import("@/lib/services/auth");
    const parsed = userRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid registration payload",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { email, password, firstName, lastName, phone, country, currency } =
      parsed.data;

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
