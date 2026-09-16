# Educado, Pero Perdido — App MVP
## Arquitectura del sistema

## 1. Visión del producto

Una app que convierte los conceptos del libro *"Educado, Pero Perdido"* en una práctica diaria: cada vez que el usuario elige la opción más barata frente a una más cara (café OXXO vs. Starbucks, comida casera vs. restaurante, transporte público vs. Uber), la diferencia se registra como ahorro. Ese ahorro alimenta metas, se refuerza con contenido del libro (micro-lecciones por capítulo), un diario reflexivo de 90 días (reutilizando el lead magnet *"Educado, Pero Despierto"*) y el arquetipo obtenido en el quiz existente (*"El Test que Deberían Darte al Graduarte"*).

**Eje rector**: decisión consciente → ahorro visible → contenido que refuerza el hábito → meta cumplida → upsell a coaching grupal.

## 2. Decisión de stack

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Compatible con lo que ya generas en Lovable — puedes seguir iterando ahí o migrar este código tal cual |
| Estilos | Tailwind CSS + tokens de marca | Ya tienes identidad visual definida (negro, dorado #C8A84B, Barlow Condensed, Playfair Display) — se traduce directo a tokens |
| Estado servidor | TanStack Query (React Query) | Cache, reintentos y sincronización de datos de Supabase sin boilerplate |
| Estado UI | Zustand | Modales, tabs activos, estado de onboarding — ligero, sin Redux |
| Backend | Supabase (Postgres + Auth + Edge Functions + Row Level Security) | Un solo proveedor cubre DB, auth y lógica de servidor; se integra nativamente con Lovable; escala sin reescribir nada al pasar de MVP a producción real |
| Lógica de negocio | Supabase Edge Functions (Deno/TypeScript) | Cálculo de streaks, agregación de dashboard, sincronización con el quiz — cosas que no deben vivir en el cliente |
| Notificaciones (Fase 1) | Resend (correo) programado vía Supabase Cron | Recordatorios diarios sin depender de push nativo (que Lovable no soporta) |
| Hosting frontend | Vercel o Netlify | Deploy automático desde Git, gratis en el tier inicial |
| Hosting backend | Supabase Cloud (plan gratuito → Pro al escalar) | Sin servidores que administrar |

**Por qué esta arquitectura escala sin reescritura**: Postgres con Row Level Security es la misma base de datos que usarías en producción con miles de usuarios — no es una base "de prototipo". Cuando llegue la Fase 2 (integración real con Kuspit), solo agregas una tabla `investment_accounts` y una Edge Function nueva que llama a la API de Kuspit; el resto del sistema no cambia.

## 3. Arquitectura de alto nivel

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (React SPA)                    │
│  Vite + React + TS + Tailwind + React Query + Zustand         │
│  Deploy: Vercel                                                │
└───────────────────────────┬────────────────────────────────┘
                              │ HTTPS (Supabase JS Client)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                          SUPABASE                              │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │  Auth         │  │  Postgres +    │  │  Edge Functions   │  │
│  │  (email/pwd,  │  │  Row Level     │  │  (Deno/TS)        │  │
│  │  magic link)  │  │  Security      │  │  - decisions      │  │
│  │               │  │                │  │  - dashboard-     │  │
│  │               │  │                │  │    summary        │  │
│  │               │  │                │  │  - journal        │  │
│  │               │  │                │  │  - goals          │  │
│  │               │  │                │  │  - lessons-       │  │
│  │               │  │                │  │    recommended    │  │
│  │               │  │                │  │  - quiz-sync      │  │
│  │               │  │                │  │  - daily-reminder │  │
│  │               │  │                │  │    (cron)         │  │
│  └──────────────┘  └───────────────┘  └────────┬─────────┘  │
└───────────────────────────────────────────────┼────────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────┐
                    ▼                              ▼               ▼
          ┌──────────────────┐          ┌──────────────────┐  ┌─────────────┐
          │  Quiz existente    │          │  Resend (email)   │  │  Fase 2:     │
          │  (Lovable app)     │          │  recordatorios     │  │  Kuspit API  │
          │  → webhook a       │          │                    │  │  (inversión  │
          │  quiz-sync         │          │                    │  │  real)       │
          └──────────────────┘          └──────────────────┘  └─────────────┘
```

## 4. Estructura de archivos

```
educado-app/
├── ARCHITECTURE.md
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── index.html
├── .env.example
├── supabase/
│   ├── schema.sql                  # Esquema completo + RLS policies
│   └── functions/
│       ├── decisions/index.ts      # POST/GET decisiones + recalcular streak
│       ├── dashboard-summary/index.ts
│       ├── journal/index.ts
│       ├── goals/index.ts
│       ├── lessons-recommended/index.ts
│       └── quiz-sync/index.ts      # Webhook desde la app del quiz
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css                   # Tokens de marca + Tailwind base
    ├── types/
    │   └── database.ts             # Tipos generados del esquema
    ├── lib/
    │   ├── supabase.ts             # Cliente Supabase
    │   └── queryClient.ts
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── useDashboard.ts
    │   ├── useDecisions.ts
    │   ├── useJournal.ts
    │   ├── useGoals.ts
    │   └── useLessons.ts
    ├── store/
    │   └── uiStore.ts              # Zustand: modales, onboarding step
    ├── components/
    │   ├── layout/
    │   │   ├── AppShell.tsx
    │   │   └── BottomNav.tsx
    │   ├── dashboard/
    │   │   ├── SavingsCounter.tsx
    │   │   ├── StreakBadge.tsx
    │   │   └── GoalProgressCard.tsx
    │   ├── decisions/
    │   │   ├── DecisionForm.tsx
    │   │   └── DecisionHistoryItem.tsx
    │   ├── journal/
    │   │   └── JournalPromptCard.tsx
    │   ├── lessons/
    │   │   └── LessonCard.tsx
    │   └── ui/
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       └── ProgressBar.tsx
    └── pages/
        ├── OnboardingPage.tsx
        ├── DashboardPage.tsx
        ├── NuevaDecisionPage.tsx
        ├── DiarioPage.tsx
        ├── LeccionesPage.tsx
        ├── MetasPage.tsx
        └── PerfilPage.tsx
```

## 5. Esquema de base de datos (resumen — ver `supabase/schema.sql` para el DDL completo)

- **profiles** — extiende `auth.users`: nombre, arquetipo del quiz, áreas débiles, racha actual/más larga, fecha de última decisión.
- **categories** — categorías de decisión (café, comida, transporte, compra impulsiva, libre) con ícono.
- **decisions** — cada decisión consciente: opción cara/barata, montos, ahorro calculado, categoría, nota, fecha.
- **savings_goals** — metas de ahorro del usuario: monto objetivo, monto actual, fecha límite, estado.
- **transfers** — registro (Fase 1: manual) de cuándo el usuario marcó que transfirió su ahorro acumulado a su cuenta real.
- **journal_prompts** — banco de preguntas de reflexión, ligadas a capítulo del libro.
- **journal_entries** — respuestas del usuario, opcionalmente ligadas a una decisión.
- **lessons** — micro-lecciones de 30 segundos por capítulo del libro.
- **lesson_progress** — qué lecciones completó cada usuario.
- **achievements** / **user_achievements** — gamificación (rachas, hitos de ahorro).
- **quiz_results** — resultado del arquetipo, sincronizado desde la app del quiz vía webhook.

Todas las tablas tienen **Row Level Security**: un usuario solo puede leer/escribir sus propias filas. `categories`, `journal_prompts`, `lessons` y `achievements` son de solo lectura pública (contenido curado por ti desde el dashboard de Supabase).

## 6. Endpoints de API (Edge Functions)

| Método | Endpoint | Qué hace |
|---|---|---|
| `POST` | `/decisions` | Crea una decisión, calcula el ahorro, actualiza la racha y el total del usuario, revisa si desbloqueó un logro. Devuelve el resumen actualizado. |
| `GET` | `/decisions?limit=&offset=` | Historial paginado de decisiones. |
| `GET` | `/dashboard-summary` | Agregado: ahorro total, racha actual, progreso de la meta activa, próxima lección recomendada. Una sola llamada para pintar el dashboard. |
| `POST` | `/journal` | Crea una entrada de diario, opcionalmente ligada a una decisión. |
| `GET` | `/journal?limit=` | Historial del diario. |
| `POST` | `/goals` | Crea una meta de ahorro. |
| `PATCH` | `/goals/:id` | Actualiza monto/estado de una meta. |
| `GET` | `/lessons-recommended` | Lecciones sugeridas según el arquetipo y áreas débiles del usuario (del quiz). |
| `POST` | `/quiz-sync` | Webhook: la app del quiz (Lovable) llama aquí cuando alguien termina el test, para crear/actualizar su arquetipo en esta app. |

Operaciones simples de solo lectura (categorías, detalle de una lección) se hacen directo desde el cliente con el SDK de Supabase + RLS, sin necesidad de Edge Function — así minimizas latencia y código de backend.

## 7. Arquitectura de la interfaz (frontend)

**Flujo de navegación:**
```
Onboarding (una vez)
  └─ Bienvenida → Selección de arquetipo (o "ya hice el quiz") → Meta inicial → Dashboard

Dashboard (home)
  ├─ Contador de ahorro del mes + racha
  ├─ Progreso de meta activa
  ├─ Botón grande "Registrar decisión" (acción principal)
  ├─ Lección recomendada del día
  └─ Bottom nav → Diario | Lecciones | Metas | Perfil

Nueva Decisión (modal o página)
  └─ Categoría → Opción cara/barata → Confirmar → Animación de ahorro sumado

Diario
  └─ Prompt del día → Respuesta → Historial de entradas

Lecciones
  └─ Lista por capítulo → Detalle → Marcar como completada

Metas
  └─ Lista de metas → Crear meta → Detalle con barra de progreso → CTA "Transferir ahora" (deep link banco)

Perfil
  └─ Arquetipo + áreas débiles → Logros → Configuración → CTA hacia el libro / coaching
```

**Principio de diseño**: el Dashboard es la pantalla que se abre siempre — todo lo demás es un desvío corto que regresa ahí. El botón "Registrar decisión" es la acción más grande y visible de toda la app, porque es el evento que genera todo el valor del producto.

## 8. Roadmap técnico hacia Fase 2

1. Agregar tabla `investment_accounts` (proveedor, id de cuenta externa, estado de vinculación).
2. Nueva Edge Function `kuspit-connect` que inicia el flujo OAuth/KYC con la API de Kuspit.
3. Nueva Edge Function `kuspit-invest` que, en vez de solo marcar `transfers.status = 'manual'`, ejecuta la transferencia real vía la API SPEI de Kuspit y actualiza el balance real.
4. El resto del sistema (dashboard, streaks, journal, lessons) no requiere cambios — fue diseñado para eso desde el esquema.
