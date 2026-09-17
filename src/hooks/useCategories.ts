import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Category } from "../types/database";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as (Category & { example_expensive: string | null; example_cheap: string | null })[];
    },
    staleTime: 5 * 60_000, // las categorías casi no cambian, cachea 5 min
  });
}
