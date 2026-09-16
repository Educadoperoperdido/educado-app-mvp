// supabase/functions/dashboard-summary/index.ts
// GET /dashboard-summary -> todo lo que necesita pintar el home en una sola llamada
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
  if (!user) {
    return new Response(JSON.stringify({ error: "No autenticado" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const [profileRes, activeGoalRes, monthDecisionsRes, recommendedLessonRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("savings_goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("decisions")
      .select("saved_amount, decided_at")
      .eq("user_id", user.id)
      .gte("decided_at", firstDayOfMonth()),
    supabase
      .from("lessons")
      .select("*")
      .limit(1)
      .maybeSingle(),
  ]);

  if (profileRes.error) return jsonError(profileRes.error.message);

  const monthTotal = (monthDecisionsRes.data ?? []).reduce(
    (sum, d) => sum + Number(d.saved_amount),
    0
  );

  return jsonOk({
    profile: profileRes.data,
    active_goal: activeGoalRes.data ?? null,
    month_saved: monthTotal,
    decisions_this_month: monthDecisionsRes.data?.length ?? 0,
    recommended_lesson: recommendedLessonRes.data ?? null,
  });
});

function firstDayOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}

function jsonOk(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function jsonError(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
