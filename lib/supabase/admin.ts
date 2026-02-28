import { createClient } from "@supabase/supabase-js";
import type { Database } from "./client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase URL or Service Role Key in environment variables",
  );
}

// Create an admin client for server-side operations with service role key
// This has elevated permissions for database operations
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export default supabaseAdmin;
