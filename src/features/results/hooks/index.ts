import { useQuery } from "@tanstack/react-query";
import { fetchResult, QuizResult } from "../api";

export const useResult = (resultId: string | null) =>
  useQuery<QuizResult>({
    queryKey: ["results", resultId],
    queryFn: () => fetchResult(resultId ?? ""),
    enabled: Boolean(resultId),
  });
