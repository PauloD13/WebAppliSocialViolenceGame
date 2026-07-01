import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchQuiz, submitQuiz, QuizPayload, SubmitQuizPayload } from "../api";

export const useQuiz = (params: { sessionId: string; trailId?: string }) =>
  useQuery<QuizPayload>({
    queryKey: ["quiz", params.sessionId, params.trailId],
    queryFn: () => fetchQuiz(params),
    enabled: Boolean(params.sessionId && params.trailId),
  });

export const useSubmitQuiz = () =>
  useMutation<
    {
      resultId: string;
    },
    Error,
    SubmitQuizPayload
  >({
    mutationFn: submitQuiz,
  });
