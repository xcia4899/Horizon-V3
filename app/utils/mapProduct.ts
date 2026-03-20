import type { Product } from "~/types/data/products";
import type { Database } from "@/types/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export const mapProduct = (item: ProductRow): Product => {
  return {
    id: item.id,
    brand: item.brand ?? "",
    name: item.name ?? "",
    subtitle: item.subtitle ?? "",
    category: item.category ?? "",
    discount: item.discount ?? 0,
    price: item.price ?? 0,
    onsale: item.onsale ?? false,
    color: item.color ?? "",
    description: item.description ?? "",
    images: {
      main: "/images/default.jpg",
      thumbnails: [],
    },
    details: [],
    highlights: {
      title: "",
      description: "",
      items: [],
    },
    tags: item.tags ?? [],
  };
};