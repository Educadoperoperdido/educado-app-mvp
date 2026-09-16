import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { callFunction } from "../lib/supabase";
import type { JournalEntry } from "../types/database";

export function useJournalEntries(limit = 20) {
  return useQuery({
    queryKey: ["journal", limit],
    queryFn: () => callFunction<{ entries: JournalEntry[] }>("journal", { query: { limit: String(limit) } }),
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { prompt_id?: string; decision_id?: string; content: string }) =>
      callFunction<{ entry: JournalEntry }>("journal", { method: "POST", body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journal"] }),
  });
}
