# Educado, Pero Perdido — App (MVP)

## Puesta en marcha

### 1. Crear el proyecto en Supabase
1. Crea un proyecto en [supabase.com](https://supabase.com) (plan gratuito alcanza para el MVP).
2. Ve a **SQL Editor** y pega el contenido completo de `supabase/schema.sql`. Ejecútalo — crea todas las tablas, políticas de seguridad y datos iniciales (categorías, logros).
3. Ve a **Project Settings > API** y copia tu `Project URL` y `anon public key`.

### 2. Configurar el frontend
```bash
cp .env.example .env
# pega tu URL y anon key en .env
npm install
npm run dev
```
Abre `http://localhost:5173`.

### 3. Desplegar las Edge Functions
Necesitas el [Supabase CLI](https://supabase.com/docs/guides/cli):
```bash
supabase login
supabase link --project-ref TU_PROJECT_REF
supabase functions deploy decisions
supabase functions deploy dashboard-summary
supabase functions deploy journal
supabase functions deploy goals
supabase functions deploy lessons-recommended
supabase functions deploy quiz-sync
```
En **Project Settings > Edge Functions > Secrets**, agrega `QUIZ_WEBHOOK_SECRET` con un valor que tú inventes (lo usarás también en el webhook del quiz de Lovable).

### 4. Cargar contenido real
Las tablas `lessons` y `journal_prompts` están vacías — llénalas desde el **Table Editor** de Supabase con el contenido real de tus 10 capítulos. Es contenido curado por ti, no generado por la app.

### 5. Conectar el quiz existente (opcional, para personalización)
En tu app de Lovable del quiz, agrega una llamada HTTP al terminar el test:
```
POST https://TU_PROYECTO.supabase.co/functions/v1/quiz-sync
Headers: x-webhook-secret: EL_SECRETO_QUE_CONFIGURASTE
Body: { "email": "...", "archetype": "...", "weak_areas": ["dinero","habitos"] }
```

### 6. Desplegar el frontend
```bash
npm run build
```
Sube la carpeta `dist/` a Vercel o Netlify, y agrega las mismas variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) en su panel de configuración.

## Notas
- Esta es una **PWA** (web app), no una app nativa — ver la conversación sobre limitaciones de Lovable/herramientas no-code para el paso a nativo.
- El envío de correos de recordatorio (Resend + Supabase Cron) no está incluido en este MVP; es el siguiente paso natural una vez que tengas usuarios activos.
- Ver `ARCHITECTURE.md` para el diseño completo del sistema y el roadmap hacia la Fase 2 (integración real de inversión con Kuspit).
