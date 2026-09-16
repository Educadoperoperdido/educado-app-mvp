import { useQuery } from "@tanstack/react-query";
import { callFunction } from "../lib/supabase";
import type { DashboardSummary } from "../types/database";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => callFunction<DashboardSummary>("dashboard-summary"),
    staleTime: 30_000,
  });
}
