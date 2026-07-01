import { useMutation } from "@tanstack/react-query";
import { createSession, CreateSessionResponse } from "../api";
import { NicknamePayload } from "../types";

export const useCreateSession = () =>
  useMutation<CreateSessionResponse, Error, NicknamePayload>({
    mutationFn: createSession,
  });
