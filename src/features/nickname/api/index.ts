import { api } from "../../../shared/api/axiosClient";
import { NicknamePayload } from "../types";

export type CreateSessionResponse = {
  sessionId: string;
  nickname: string;
};

export const createSession = async (payload: NicknamePayload) => {
  const response = await api.post("/sessions", payload);
  return response.data as CreateSessionResponse;
};
