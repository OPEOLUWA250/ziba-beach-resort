import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate credentials are present
if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "❌ CRITICAL: Missing Supabase credentials for server client.",
    {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      env: process.env.NODE_ENV,
    },
  );
}

// Create a server client with service role key (bypasses RLS)
export const supabaseServer = createClient(
  supabaseUrl || "",
  supabaseServiceKey || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

// Export credential check helper
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseServiceKey);
}
