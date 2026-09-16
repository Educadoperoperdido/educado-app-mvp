import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { callFunction } from "../lib/supabase";
import type { Achievement, Decision } from "../types/database";

interface NewDecisionInput {
  category_id: string | null;
  expensive_label: string;
  expensive_amount: number;
  cheap_label: string;
  cheap_amount: number;
  note?: string;
}

interface CreateDecisionResponse {
  decision: Decision;
  streak: number;
  total_saved: number;
  unlocked_achievements: Achievement[];
}

export function useDecisionsHistory(limit = 20) {
  return useQuery({
    queryKey: ["decisions", limit],
    queryFn: () => callFunction<{ decisions: Decision[] }>("decisions", { query: { limit: String(limit) } }),
  });
}

export function useCreateDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewDecisionInput) =>
      callFunction<CreateDecisionResponse>("decisions", { method: "POST", body: input }),
    onSuccess: () => {
      // Refrescar dashboard y listado tras registrar una decisión nueva
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
    },
  });
}
