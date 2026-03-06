import { NextRequest, NextResponse } from "next/server";
import { rateLimitByIp } from "@/lib/security/rate-limit";
import { userLoginSchema } from "@/lib/security/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const rate = rateLimitByIp(request.headers, "api:user:login", 20, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        },
      );
    }

    const body = await request.json();
    const { loginUser } = await import("@/lib/services/auth");
    const parsed = userLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid login payload" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

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
