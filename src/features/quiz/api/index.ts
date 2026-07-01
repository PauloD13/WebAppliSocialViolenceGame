import { api } from "../../../shared/api/axiosClient";

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

export type QuizPayload = {
  questions: QuizQuestion[];
};

export type QuizResult = {
  resultId: string;
};

export type SubmitQuizPayload = {
  sessionId: string;
  answers: { questionId: string; optionId: string }[];
};

export const fetchQuiz = async ({
  sessionId,
  trailId,
}: {
  sessionId: string;
  trailId?: string;
}) => {
  const response = await api.get("/quiz", {
    params: { sessionId, trailId },
  });
  return response.data as QuizPayload;
};

export const submitQuiz = async (payload: SubmitQuizPayload) => {
  const response = await api.post("/quiz/submit", payload);
  return response.data as QuizResult;
};
