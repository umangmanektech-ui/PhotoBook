import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let serverSupabaseInstance: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient | null {
  if (supabaseUrl && supabaseServiceKey) {
    if (!serverSupabaseInstance) {
      serverSupabaseInstance = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
        },
      });
    }
    return serverSupabaseInstance;
  }
  return null;
}
