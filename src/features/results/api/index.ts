import { api } from "../../../shared/api/axiosClient";

export type QuizResult = {
  resultId: string;
  score: number;
  total: number;
  correct: number;
  message: string;
};

export const fetchResult = async (resultId: string) => {
  const response = await api.get(`/results/${resultId}`);
  return response.data as QuizResult;
};
