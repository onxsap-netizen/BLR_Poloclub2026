import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY. Never import this file in a Client Component.
// Uses the service-role key to bypass RLS for admin operations.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in your environment variables, then redeploy."
    );
  }

  return createClient(url, key, { auth: { persistSession: false } });
}
