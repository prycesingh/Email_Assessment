import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const roleNames = ["candidate", "admin", "assessor"] as const;

export type UserRole = (typeof roleNames)[number];

/**
 * Requires the user to be authenticated. Redirects to /login if not.
 */
export async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session.user;
}

/**
 * Requires the user to be authenticated AND to have one of the allowed roles.
 * - Unauthenticated → redirect to /login
 * - Wrong role      → redirect to /unauthorized
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireUser();

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}
