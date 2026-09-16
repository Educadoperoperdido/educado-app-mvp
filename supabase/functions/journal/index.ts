// supabase/functions/journal/index.ts
// POST /journal -> crear entrada  |  GET /journal?limit= -> historial
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return jsonError("No autenticado", 401);

  if (req.method === "GET") {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? "20");
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*, journal_prompts(prompt_text, chapter_ref)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return jsonError(error.message);
    return jsonOk({ entries: data });
  }

  if (req.method === "POST") {
    const { prompt_id, decision_id, content } = await req.json();
    if (!content || content.trim().length === 0) return jsonError("El contenido no puede estar vacío", 400);

    const { data, error } = await supabase
      .from("journal_entries")
      .insert({ user_id: user.id, prompt_id: prompt_id ?? null, decision_id: decision_id ?? null, content })
      .select()
      .single();
    if (error) return jsonError(error.message);
    return jsonOk({ entry: data });
  }

  return jsonError("Método no soportado", 405);
});

function jsonOk(payload: unknown) {
  return new Response(JSON.stringify(payload), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
function jsonError(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
