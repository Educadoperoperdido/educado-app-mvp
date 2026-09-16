export interface Profile {
  id: string;
  full_name: string | null;
  archetype: string | null;
  weak_areas: string[];
  current_streak: number;
  longest_streak: number;
  last_decision_date: string | null;
  total_saved: number;
  currency: string;
  onboarding_completed: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
}

export interface Decision {
  id: string;
  user_id: string;
  category_id: string | null;
  expensive_label: string;
  expensive_amount: number;
  cheap_label: string;
  cheap_amount: number;
  saved_amount: number;
  note: string | null;
  decided_at: string;
  categories?: { name: string; icon: string };
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  status: "active" | "completed" | "archived";
}

export interface JournalEntry {
  id: string;
  user_id: string;
  prompt_id: string | null;
  decision_id: string | null;
  content: string;
  created_at: string;
  journal_prompts?: { prompt_text: string; chapter_ref: string };
}

export interface Lesson {
  id: string;
  chapter_number: number;
  chapter_title: string;
  title: string;
  content_short: string;
  content_full: string | null;
  category: string;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
}

export interface DashboardSummary {
  profile: Profile;
  active_goal: SavingsGoal | null;
  month_saved: number;
  decisions_this_month: number;
  recommended_lesson: Lesson | null;
}
