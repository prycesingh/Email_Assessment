import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";
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

/**
 * Returns the list of authorised admin emails from the ADMIN_EMAILS env var.
 * Empty string or unset = no admin emails configured (admin portal locked).
 */
function getAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  if (!raw.trim()) return new Set();

  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

/**
 * Resolves the current session.
 *
 * Identity is supplied by the external API gateway via request headers:
 *   X-User-Id    — the user's unique identifier (UUID from external system)
 *   X-User-Email — the user's email address
 *   X-User-Name  — the user's display name (optional)
 *
 * Role assignment and database syncing:
 *   1. If the user's email is in ADMIN_EMAILS (if configured) → role = "admin"
 *   2. Otherwise, look up the user's role in the database.
 *   3. If they exist in the database, we use their database-configured role.
 *   4. If they do not exist in the database, we auto-provision them on the fly
 *      with the resolved role (defaulting to "candidate" if not an admin by email)
 *      to ensure that subsequent foreign keys on `candidate_id` match.
 *
 * If no identity headers are present this function returns null, meaning
 * unauthenticated. The RBAC helpers redirect to /login accordingly.
 */
export async function auth(): Promise<AuthSession | null> {
  try {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");
    const userEmail = headersList.get("x-user-email");
    const userName = headersList.get("x-user-name");

    if (!userId || !userEmail) {
      return null;
    }

    const adminEmails = getAdminEmails();
    const isEmailAdmin = adminEmails.has(userEmail.toLowerCase());

    let role: AuthUserRole = isEmailAdmin ? "admin" : "candidate";
    let resolvedId = userId;
    let resolvedName = userName ?? userEmail.split("@")[0];

    // Query DB to see if the user exists. Match by ID or email to prevent duplicates.
    const [dbUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: roles.name
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(
        sql`${users.id} = ${userId} OR ${users.email} = ${userEmail.toLowerCase()}`
      )
      .limit(1);

    if (dbUser) {
      resolvedId = dbUser.id;
      resolvedName = dbUser.name;
      // Prioritize the email-based override from ADMIN_EMAILS, otherwise use DB role.
      role = isEmailAdmin ? "admin" : (dbUser.role as AuthUserRole);
    } else {
      // Auto-provision user in the database so foreign keys work.
      // Lookup the role ID from the database to be safe.
      const [roleRecord] = await db
        .select({ id: roles.id })
        .from(roles)
        .where(eq(roles.name, role))
        .limit(1);

      const roleId = roleRecord?.id ?? (role === "admin" ? 2 : 1);

      await db.insert(users).values({
        id: userId,
        name: resolvedName,
        email: userEmail.toLowerCase(),
        roleId,
        status: "active"
      });
    }

    return {
      user: {
        id: resolvedId,
        name: resolvedName,
        email: userEmail,
        role
      }
    };
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message.includes("Dynamic server usage") ||
        (err as any).digest === "DYNAMIC_SERVER_USAGE")
    ) {
      throw err;
    }
    console.error("Auth helper error:", err);
    return null;
  }
}

/** Called by API routes that need the user object. Returns null if unauthenticated. */
export async function getSession(): Promise<AuthSession | null> {
  return auth();
}

export async function signIn() {
  return { ok: true };
}

export async function signOut() {
  return { ok: true };
}

export const handlers = {
  GET: async () => new Response("Authentication is handled by the external API gateway.", { status: 404 }),
  POST: async () => new Response("Authentication is handled by the external API gateway.", { status: 404 })
};
