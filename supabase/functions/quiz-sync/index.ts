// supabase/functions/quiz-sync/index.ts
// POST /quiz-sync -> llamado por la app del quiz (Lovable) cuando alguien termina el test.
// Usa el SERVICE ROLE key (no el anon key) porque no viene con sesión de usuario logueado.
// Guarda el resultado y, si el usuario ya tiene cuenta en esta app (mismo email), le actualiza el perfil.
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no soportado" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Autenticación simple del webhook por secreto compartido (configúralo en el quiz de Lovable)
  const webhookSecret = req.headers.get("x-webhook-secret");
  if (webhookSecret !== Deno.env.get("QUIZ_WEBHOOK_SECRET")) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { email, archetype, weak_areas } = await req.json();
  if (!email || !archetype) {
    return new Response(JSON.stringify({ error: "Faltan email o archetype" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 1. Buscar si ya existe un usuario de auth con ese email
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const matchedUser = authUsers.users.find((u) => u.email === email);

  const { error: quizInsertError } = await supabase.from("quiz_results").insert({
    user_id: matchedUser?.id ?? null,
    email,
    archetype,
    weak_areas: weak_areas ?? [],
  });

  if (quizInsertError) {
    return new Response(JSON.stringify({ error: quizInsertError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 3. Si ya tiene cuenta en la app, actualizar su perfil directamente
  if (matchedUser) {
    await supabase
      .from("profiles")
      .update({ archetype, weak_areas: weak_areas ?? [] })
      .eq("id", matchedUser.id);
  }

  return new Response(
    JSON.stringify({ synced: true, matched_existing_user: Boolean(matchedUser) }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
