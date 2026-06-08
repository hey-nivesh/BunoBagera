import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DASHBOARD_PREFIX = "/dashboard";
const AUTH_ROUTES = new Set(["/login", "/signup"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const authed = !!token;

  // Redirect unauthenticated users away from dashboard, except for the GitHub callback
  if (pathname.startsWith(DASHBOARD_PREFIX) && pathname !== "/dashboard/github/callback" && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login / signup
  if (AUTH_ROUTES.has(pathname) && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match every path except:
     *  - _next/static (static assets)
     *  - _next/image  (image optimisation)
     *  - favicon.ico
     *  - public files (svg, png, jpg, …)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
