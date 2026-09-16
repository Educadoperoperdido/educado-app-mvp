// supabase/functions/lessons-recommended/index.ts
// GET /lessons-recommended -> lecciones priorizadas por las áreas débiles del arquetipo del usuario
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("weak_areas")
    .eq("id", user.id)
    .single();

  const { data: completed } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id);
  const completedIds = new Set((completed ?? []).map((c) => c.lesson_id));

  const weakAreas: string[] = profile?.weak_areas ?? [];

  let query = supabase.from("lessons").select("*").order("sort_order", { ascending: true });
  const { data: allLessons, error } = await query;
  if (error) return jsonError(error.message);

  const pending = (allLessons ?? []).filter((l) => !completedIds.has(l.id));

  // Priorizar lecciones de las categorías marcadas como débiles en el quiz
  const prioritized = [
    ...pending.filter((l) => weakAreas.includes(l.category)),
    ...pending.filter((l) => !weakAreas.includes(l.category)),
  ];

  return jsonOk({ lessons: prioritized.slice(0, 10) });
});

function jsonOk(payload: unknown) {
  return new Response(JSON.stringify(payload), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
function jsonError(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
