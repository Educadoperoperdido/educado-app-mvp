-- ============================================================
-- Educado, Pero Perdido — Esquema de base de datos (Supabase/Postgres)
-- ============================================================

-- ---------- EXTENSIONES ----------
create extension if not exists "uuid-ossp";

-- ---------- PROFILES ----------
-- Extiende auth.users con datos de la app.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  archetype text,                          -- resultado del quiz, ej. "El Postergador Crónico"
  weak_areas jsonb default '[]'::jsonb,    -- ej. ["dinero", "habitos"]
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_decision_date date,
  total_saved numeric(12,2) not null default 0,
  currency text not null default 'USD',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- CATEGORIES ----------
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon text not null,             -- nombre de ícono (lucide-react)
  is_default boolean not null default true,
  sort_order int not null default 0
);

insert into public.categories (name, icon, sort_order) values
  ('Café', 'coffee', 1),
  ('Comida', 'utensils', 2),
  ('Transporte', 'car', 3),
  ('Compra impulsiva', 'shopping-bag', 4),
  ('Suscripciones', 'repeat', 5),
  ('Libre', 'sparkles', 6);

-- ---------- DECISIONS ----------
create table public.decisions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id),
  expensive_label text not null,          -- ej. "Starbucks"
  expensive_amount numeric(10,2) not null,
  cheap_label text not null,              -- ej. "Café OXXO"
  cheap_amount numeric(10,2) not null,
  saved_amount numeric(10,2) generated always as (expensive_amount - cheap_amount) stored,
  note text,
  decided_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint positive_saving check (expensive_amount >= cheap_amount)
);

create index idx_decisions_user_date on public.decisions(user_id, decided_at desc);

-- ---------- SAVINGS GOALS ----------
create table public.savings_goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) not null default 0,
  deadline date,
  status text not null default 'active' check (status in ('active','completed','archived')),
  created_at timestamptz not null default now()
);

create index idx_goals_user_status on public.savings_goals(user_id, status);

-- ---------- TRANSFERS (Fase 1: registro manual) ----------
create table public.transfers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null,
  method text not null default 'manual',  -- 'manual' | 'kuspit' (fase 2)
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

-- ---------- JOURNAL ----------
create table public.journal_prompts (
  id uuid primary key default uuid_generate_v4(),
  chapter_ref text,                       -- ej. "Capítulo 3 — Hábitos"
  prompt_text text not null,
  is_active boolean not null default true
);

create table public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt_id uuid references public.journal_prompts(id),
  decision_id uuid references public.decisions(id),  -- opcional: reflexión ligada a una decisión
  content text not null,
  created_at timestamptz not null default now()
);

create index idx_journal_user_date on public.journal_entries(user_id, created_at desc);

-- ---------- LESSONS ----------
create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  chapter_number int not null,
  chapter_title text not null,
  title text not null,
  content_short text not null,            -- micro-lección de 30s
  content_full text,                      -- opcional, extracto más largo
  category text not null,                 -- 'dinero' | 'habitos' | 'relaciones' | 'ei' | 'tecnologia' | 'decisiones'
  sort_order int not null default 0
);

create table public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ---------- ACHIEVEMENTS ----------
create table public.achievements (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,              -- ej. 'streak_7'
  name text not null,
  description text not null,
  icon text not null,
  criteria_type text not null,            -- 'streak' | 'total_saved' | 'decisions_count'
  criteria_value numeric not null
);

insert into public.achievements (code, name, description, icon, criteria_type, criteria_value) values
  ('streak_3', 'Primeros 3 días', 'Registraste decisiones 3 días seguidos', 'flame', 'streak', 3),
  ('streak_7', 'Una semana consciente', 'Registraste decisiones 7 días seguidos', 'flame', 'streak', 7),
  ('streak_30', 'Hábito instalado', '30 días seguidos tomando mejores decisiones', 'trophy', 'streak', 30),
  ('saved_500', 'Primeros $500', 'Acumulaste $500 en decisiones conscientes', 'piggy-bank', 'total_saved', 500),
  ('saved_2000', 'Meta de verdad', 'Acumulaste $2,000 en decisiones conscientes', 'piggy-bank', 'total_saved', 2000);

create table public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- ---------- QUIZ RESULTS (sincronizado desde la app del quiz) ----------
create table public.quiz_results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  email text not null,                    -- para matchear si el usuario aún no tiene cuenta en la app
  archetype text not null,
  weak_areas jsonb not null default '[]'::jsonb,
  taken_at timestamptz not null default now()
);

create index idx_quiz_results_email on public.quiz_results(email);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.decisions enable row level security;
alter table public.savings_goals enable row level security;
alter table public.transfers enable row level security;
alter table public.journal_entries enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.user_achievements enable row level security;
alter table public.quiz_results enable row level security;
alter table public.categories enable row level security;
alter table public.journal_prompts enable row level security;
alter table public.lessons enable row level security;
alter table public.achievements enable row level security;

-- Tablas privadas: el usuario solo ve/edita lo suyo
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own decisions" on public.decisions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own goals" on public.savings_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own transfers" on public.transfers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own journal" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own lesson progress" on public.lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own achievements" on public.user_achievements
  for select using (auth.uid() = user_id);

create policy "own quiz results" on public.quiz_results
  for select using (auth.uid() = user_id);

-- Tablas de contenido curado: lectura pública, escritura solo desde el dashboard/service role
create policy "public read categories" on public.categories for select using (true);
create policy "public read prompts" on public.journal_prompts for select using (is_active = true);
create policy "public read lessons" on public.lessons for select using (true);
create policy "public read achievements" on public.achievements for select using (true);

-- ============================================================
-- TRIGGER: crear profile automáticamente al registrarse
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
