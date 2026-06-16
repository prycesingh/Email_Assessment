import { eq } from "drizzle-orm";

import { db } from "@/db";
import { roles, users } from "@/db/schema";

export type AuthUserRole = "candidate" | "admin" | "assessor";

export type AuthSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: AuthUserRole;
  };
};

export async function auth(): Promise<AuthSession> {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: roles.name
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .limit(1);

  if (user?.id) {
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as AuthUserRole
      }
    };
  }

  return {
    user: {
      id: "demo-user",
      name: "Demo User",
      email: "demo@example.com",
      role: "admin"
    }
  };
}

export async function signIn() {
  return { ok: true };
}

export async function signOut() {
  return { ok: true };
}

export const handlers = {
  GET: async () => new Response("Authentication disabled.", { status: 404 }),
  POST: async () => new Response("Authentication disabled.", { status: 404 })
};
