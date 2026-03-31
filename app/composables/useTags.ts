// useProducts.ts
import tags from "@/assets/data/productTags.json";
import type {SidebarList} from "~/types/ui/sidebar"


export const useTags =  () => {
  return tags as SidebarList[];
};
