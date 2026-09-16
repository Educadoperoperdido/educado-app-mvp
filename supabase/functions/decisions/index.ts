// supabase/functions/decisions/index.ts
// POST /decisions  -> crea una decisión, recalcula racha/total, revisa logros
// GET  /decisions?limit=&offset= -> historial paginado
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

  if (req.method === "GET") {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? "20");
    const offset = Number(url.searchParams.get("offset") ?? "0");

    const { data, error } = await supabase
      .from("decisions")
      .select("*, categories(name, icon)")
      .eq("user_id", user.id)
      .order("decided_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return jsonError(error.message);
    return jsonOk({ decisions: data });
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { category_id, expensive_label, expensive_amount, cheap_label, cheap_amount, note } = body;

    if (!expensive_label || !cheap_label || expensive_amount == null || cheap_amount == null) {
      return jsonError("Faltan campos requeridos", 400);
    }
    if (Number(expensive_amount) < Number(cheap_amount)) {
      return jsonError("El monto caro debe ser mayor o igual al barato", 400);
    }

    // 1. Insertar la decisión
    const { data: decision, error: insertError } = await supabase
      .from("decisions")
      .insert({
        user_id: user.id,
        category_id: category_id ?? null,
        expensive_label,
        expensive_amount,
        cheap_label,
        cheap_amount,
        note: note ?? null,
      })
      .select()
      .single();

    if (insertError) return jsonError(insertError.message);

    // 2. Recalcular racha y total acumulado del perfil
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("current_streak, longest_streak, last_decision_date, total_saved")
      .eq("id", user.id)
      .single();

    if (profileError) return jsonError(profileError.message);

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    let newStreak = profile.current_streak;
    if (profile.last_decision_date === today) {
      // ya había registrado hoy, no cambia la racha
    } else if (profile.last_decision_date === yesterday) {
      newStreak = profile.current_streak + 1;
    } else {
      newStreak = 1; // se rompió la racha o es la primera decisión
    }

    const newLongest = Math.max(newStreak, profile.longest_streak);
    const newTotal = Number(profile.total_saved) + Number(decision.saved_amount);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_decision_date: today,
        total_saved: newTotal,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) return jsonError(updateError.message);

    // 3. Revisar logros desbloqueados
    const unlockedAchievements = await checkAchievements(supabase, user.id, {
      streak: newStreak,
      total_saved: newTotal,
    });

    return jsonOk({
      decision,
      streak: newStreak,
      total_saved: newTotal,
      unlocked_achievements: unlockedAchievements,
    });
  }

  return jsonError("Método no soportado", 405);
});

async function checkAchievements(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  stats: { streak: number; total_saved: number }
) {
  const { data: achievements } = await supabase.from("achievements").select("*");
  if (!achievements) return [];

  const { data: alreadyEarned } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);
  const earnedIds = new Set((alreadyEarned ?? []).map((a) => a.achievement_id));

  const newlyUnlocked = [];
  for (const a of achievements) {
    if (earnedIds.has(a.id)) continue;
    const value = a.criteria_type === "streak" ? stats.streak : stats.total_saved;
    if (value >= a.criteria_value) {
      await supabase.from("user_achievements").insert({ user_id: userId, achievement_id: a.id });
      newlyUnlocked.push(a);
    }
  }
  return newlyUnlocked;
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
