import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { callFunction } from "../lib/supabase";
import type { SavingsGoal } from "../types/database";

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: () => callFunction<{ goals: SavingsGoal[] }>("goals"),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; target_amount: number; deadline?: string }) =>
      callFunction<{ goal: SavingsGoal }>("goals", { method: "POST", body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });
}
