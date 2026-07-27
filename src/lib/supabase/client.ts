import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jayggxfyztajmtwmzxlb.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_868D6cusG9TA4X7WOm-NKg_-am6jfZl";

  return createBrowserClient(supabaseUrl, supabaseKey);
}
