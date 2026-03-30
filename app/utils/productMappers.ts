// utils/productMappers.ts
import type { Database, Json } from "@/types/database.types";
import type { Product } from "~/types/data/products";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

export const toProductInsert = (product: Product): ProductInsert => {
  return {
    id: product.id,
    brand: product.brand,
    name: product.name,
    subtitle: product.subtitle,
    category: product.category,
    price: product.price,
    discount: product.discount,
    onsale: product.onsale,
    color: product.color,
    description: product.description,

    // 這幾個是重點
    images: product.images as unknown as Json,
    details: product.details as unknown as Json,
    highlights: product.highlights as unknown as Json,

    tags: product.tags,
  };
};