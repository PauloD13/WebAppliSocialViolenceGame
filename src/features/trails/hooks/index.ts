import { useQuery } from "@tanstack/react-query";
import { getTrails } from "../api";

export const useTrails = () => useQuery({ queryKey: ["trails"], queryFn: getTrails });
