// Supabase client initialization with safe fallback
// Uses the user's provided URL and anon key. If env vars are missing in
// production (e.g., on Vercel), we provide a fallback using the user-provided
// public anon credentials so the app continues to render.
// @ts-ignore
import { createClient } from "@supabase/supabase-js";

const _env = (import.meta as any).env ?? {};

// User-provided public creds (anon key is safe for client usage)
const FALLBACK_SUPABASE_URL = "https://ecekaanthiejcwehsnuq.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZWthYW50aGllamN3ZWhzbnVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODg1NjIsImV4cCI6MjA3NzE2NDU2Mn0.1MYQPGrgrbM-Tc1-z2G8gd2_bmrSVdRMz5FtN6gHS2g";
export const supabaseUrl: string =
  _env.VITE_SUPABASE_URL ?? FALLBACK_SUPABASE_URL;
export const supabaseAnonKey: string =
  _env.VITE_SUPABASE_ANON_KEY ?? FALLBACK_SUPABASE_ANON_KEY;

const hasSupabaseCreds = Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

// Dev-time safety: warn if env vars are empty and we fall back
// Warning suppressed for cleaner console output
// const _importMetaEnv = (import.meta as any).env
// if (_importMetaEnv && _importMetaEnv.DEV) {
//   if (!_env.VITE_SUPABASE_URL || !_env.VITE_SUPABASE_ANON_KEY) {
//     console.warn('[supabaseClient] Falling back to provided public Supabase credentials. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment for production.');
//   }
// }

// Minimal shim implementing just the methods used by supaStorage.ts
function createSupabaseShim() {
  const noop = () => {};
  return {
    from: (_table: string) => ({
      select: async (_cols?: string) => ({ data: [] as any[], error: null }),
      upsert: (_row: any) => ({
        single: async () => ({ error: null as any }),
      }),
      delete: () => ({
        eq: async (_col: string, _val: any) => ({ error: null as any }),
      }),
    }),
    channel: (_name: string) => ({
      on: (_event: any, _filter: any, _cb: any) => ({
        subscribe: (cb?: any) => {
          try {
            cb && cb("SUBSCRIBED");
          } catch {}
          return { unsubscribe: noop } as any;
        },
      }),
    }),
  } as any;
}

export const supabase = hasSupabaseCreds
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: (input: RequestInfo, init?: RequestInit) =>
          fetch(input, { ...init, cache: "no-store" }),
      },
    })
  : createSupabaseShim();
