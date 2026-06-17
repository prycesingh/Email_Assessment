import { NextResponse } from "next/server";

import type { UserRole } from "@/lib/rbac";
import { auth } from "@/auth";

/**
 * Returns { user, response: null } when authenticated, or { user: null, response } when not.
 * Usage: const { user, response } = await requireApiUser(["admin"]); if (response) return response;
 */
export async function requireApiUser(allowedRoles?: UserRole[]) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      user: null,
      response: NextResponse.json({ error: "Authentication required." }, { status: 401 })
    };
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return {
      user: null,
      response: NextResponse.json({ error: "Insufficient permissions." }, { status: 403 })
    };
  }

  return { user: session.user, response: null };
}

export function requestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
