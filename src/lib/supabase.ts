import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper para llamar Edge Functions con el token de sesión actual
export async function callFunction<T>(
  name: string,
  options: { method?: string; body?: unknown; query?: Record<string, string> } = {}
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const url = new URL(`${supabaseUrl}/functions/v1/${name}`);
  if (options.query) {
    Object.entries(options.query).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
      apikey: supabaseAnonKey,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Error de servidor");
  return json as T;
}
