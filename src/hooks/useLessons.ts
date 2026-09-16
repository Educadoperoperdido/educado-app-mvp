import { useQuery } from "@tanstack/react-query";
import { callFunction } from "../lib/supabase";
import type { Lesson } from "../types/database";

export function useRecommendedLessons() {
  return useQuery({
    queryKey: ["lessons-recommended"],
    queryFn: () => callFunction<{ lessons: Lesson[] }>("lessons-recommended"),
  });
}
