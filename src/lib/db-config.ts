export function getDatabaseUrl() {
  const envUrl = process.env.DATABASE_URL?.trim();

  if (envUrl) {
    return envUrl;
  }

  const host = process.env.DB_HOST?.trim() || "localhost";
  const port = process.env.DB_PORT?.trim() || "3306";
  const user = process.env.DB_USER?.trim();
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME?.trim() || process.env.DB_DATABASE?.trim();

  if (!user || !database) {
    throw new Error(
      "Database configuration is incomplete. Set DATABASE_URL or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME."
    );
  }

  const credentialSegment = password === undefined || password === null ? `${user}@` : `${user}:${encodeURIComponent(password)}@`;

  return `mysql://${credentialSegment}${host}:${port}/${database}`;
}
