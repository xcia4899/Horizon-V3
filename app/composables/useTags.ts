import tags from "@/assets/data/productTags.json";
import type { SidebarItem } from "~/types/ui/sidebar";

export const useTags = (): SidebarItem[] => {
  return tags as SidebarItem[];
};

export const useTagOptions = () => {
  const tagSource = useTags();

  return tagSource
    .filter((item) => item.key !== "price" && item.key !== "brand")
    .flatMap((item) => item.options)
    .map((option) => ({
      label: (option.label),
      value: (option.value),
    }));
};