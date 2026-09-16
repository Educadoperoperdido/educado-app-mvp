// supabase/functions/goals/index.ts
// POST /goals -> crear meta | PATCH /goals?id= -> actualizar meta | GET /goals -> listar
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

  const url = new URL(req.url);

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("savings_goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) return jsonError(error.message);
    return jsonOk({ goals: data });
  }

  if (req.method === "POST") {
    const { name, target_amount, deadline } = await req.json();
    if (!name || !target_amount) return jsonError("Faltan campos requeridos", 400);

    const { data, error } = await supabase
      .from("savings_goals")
      .insert({ user_id: user.id, name, target_amount, deadline: deadline ?? null })
      .select()
      .single();
    if (error) return jsonError(error.message);
    return jsonOk({ goal: data });
  }

  if (req.method === "PATCH") {
    const goalId = url.searchParams.get("id");
    if (!goalId) return jsonError("Falta el id de la meta", 400);
    const updates = await req.json();

    const { data, error } = await supabase
      .from("savings_goals")
      .update(updates)
      .eq("id", goalId)
      .eq("user_id", user.id)
      .select()
      .single();
    if (error) return jsonError(error.message);
    return jsonOk({ goal: data });
  }

  return jsonError("Método no soportado", 405);
});

function jsonOk(payload: unknown) {
  return new Response(JSON.stringify(payload), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
function jsonError(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
