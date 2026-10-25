import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "ziba_admin_session";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Protect admin routes but allow /admin-login to be accessed without authentication
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin-login")) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!token) {
      const loginUrl = new URL("/admin-login", request.url);
      const nextValue = `${pathname}${search}`;
      loginUrl.searchParams.set("next", nextValue);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.paystack.com" "https://js.paystack.co" "https://standard.paystack.co")',
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  // Default API responses to no-store, except public GET endpoints that set
  // their own CDN caching (popups: s-maxage + SWR; Instagram: revalidate).
  const cacheableApi =
    request.method === "GET" &&
    (pathname === "/api/popups" ||
      pathname === "/api/instagram/feed" ||
      pathname === "/api/reviews");

  if (pathname.startsWith("/api") && !cacheableApi) {
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
