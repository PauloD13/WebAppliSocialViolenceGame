import { api } from "../../../shared/api/axiosClient";

export type ContentItem = {
  id: string;
  title: string;
  summary: string;
  body: string;
};

export const getContentItems = async () => {
  const response = await api.get("/content");
  return response.data as ContentItem[];
};
