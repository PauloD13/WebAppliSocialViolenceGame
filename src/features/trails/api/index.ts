import { api } from "../../../shared/api/axiosClient";
import { TrailType } from "../types";

export const getTrails = async () => {
  const response = await api.get("/trails");
  return response.data as TrailType[];
};
