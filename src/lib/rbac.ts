import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const roleNames = ["candidate", "admin", "assessor"] as const;

export type UserRole = (typeof roleNames)[number];

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session.user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireUser();

  if (!allowedRoles.includes(user.role)) {
    redirect(user.role === "candidate" ? "/candidate" : "/admin");
  }

  return user;
}
