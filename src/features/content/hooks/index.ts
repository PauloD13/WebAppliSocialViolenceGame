import { useQuery } from "@tanstack/react-query";
import { getContentItems, ContentItem } from "../api";

export const useContentItems = () =>
  useQuery<ContentItem[]>({
    queryKey: ["content"],
    queryFn: getContentItems,
  });
