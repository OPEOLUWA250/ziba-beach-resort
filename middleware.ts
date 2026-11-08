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

  // Security headers (CSP, frame blocking, HSTS…) are set for every path in
  // next.config.mjs, so they also cover pages this middleware skips.
  const response = NextResponse.next();

  // Admin pages and booking/receipt pages hold guest details: browsers and
  // shared computers mustn't keep a copy.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/view-booking") ||
    pathname.startsWith("/day-pass/confirmation")
  ) {
    response.headers.set("Cache-Control", "no-store, private");
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
