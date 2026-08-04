/**
 * App config (Turso + shared defaults).
 * Prefer keeping secrets out of git if this repo is public.
 */
export const config = {
  turso: {
    databaseUrl: "libsql://private-chef-lombok-crunchy89.aws-us-east-2.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODU4NTU4NjMsImlkIjoiMDE5ZmNkNGMtN2MwMS03Nzg5LWEyMTUtN2M5NzMyNjAwYzUzIiwia2lkIjoiQ0dsakNGSGx4cUM3VUtQZ2F5OExUWENFQTI4VmF6R0pXQVRCN0theUx3WSIsInJpZCI6IjMzNTY3OWQ3LWY0MWUtNDk3Ni04MmY4LTEwNjZjOTU0NmUyNCJ9.QGnv8UVxaagpiwRmxHupwnsA7gg2emSPkZuEP7Skx79LuWc5ocY2xZr_mCDFAlShOpwwbo0BhymUFIiNaH6JBQ",
  },
} as const;
