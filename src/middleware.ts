import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware — runs before every request.
 *
 * Responsibilities:
 * 1. Ensure user is authenticated for all protected routes (/admin/*, /candidate/*, /api/*).
 *    Authentication is verified by checking for X-User-Id and X-User-Email headers
 *    injected by the external API gateway.
 * 2. In development environment, mock these headers if they are missing to allow local testing.
 *    Support query parameter `mock-role=candidate` or `mock-role=admin` to switch roles.
 * 3. Delegate role-based authorization to the application layer (pages and API handlers)
 *    where we have access to the Node.js runtime and database to query user roles.
 * 4. Add basic security response headers.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Read identity injected by the external API gateway ──────────────────
  let userId = request.headers.get("x-user-id");
  let userEmail = request.headers.get("x-user-email");
  let userName = request.headers.get("x-user-name");

  const requestHeaders = new Headers(request.headers);

  // ── Development Fallback ────────────────────────────────────────────────
  if (process.env.NODE_ENV === "development" && !userId && !userEmail) {
    const mockRole = request.nextUrl.searchParams.get("mock-role") ?? "admin";
    if (mockRole === "candidate") {
      userId = "dev-candidate-id";
      userEmail = "candidate@example.com";
      userName = "Dev Candidate";
    } else {
      // Use the seeded admin user from the local database
      userId = "1775cfec-fa0a-4490-bb58-89e05509c512";
      userEmail = "sarthak.joshi@itbd.in";
      userName = "Sarthak Joshi";
    }
    requestHeaders.set("x-user-id", userId);
    requestHeaders.set("x-user-email", userEmail);
    requestHeaders.set("x-user-name", userName ?? "");
  } else {
    // If headers exist, make sure they are in requestHeaders
    if (userId) requestHeaders.set("x-user-id", userId);
    if (userEmail) requestHeaders.set("x-user-email", userEmail);
    if (userName) requestHeaders.set("x-user-name", userName);
  }

  const isAuthenticated = !!requestHeaders.get("x-user-id") && !!requestHeaders.get("x-user-email");

  // ── Guard: Protected routes (must be authenticated) ─────────────────────
  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/candidate") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/assessments") ||
    pathname.startsWith("/api/submissions") ||
    pathname.startsWith("/api/results");

  if (isProtectedRoute && !isAuthenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ── Allow request through with security headers added ───────────────────
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  // Run on all routes except static assets and Next.js internals
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)"
  ]
};
