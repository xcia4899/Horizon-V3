import type {
  Product,
  ProductImages,
  ProductDetail,
  Highlights,
  FeatureItem,
  DetailContent,
} from "~/types/data/products";
import type { Database } from "@/types/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

// ===== raw json type =====
type RawProductImages = Partial<ProductImages>;

type RawDetailContent = Partial<DetailContent>;

type RawProductDetail = {
  section?: string | null;
  content?: RawDetailContent[] | null;
};

type RawFeatureItem = {
  id?: string | null;
  title?: string | null;
  subtitle?: string | null;
  icon?: string | null;
  desc?: string[] | null;
};

type RawHighlights = {
  title?: string | null;
  description?: string | null;
  items?: RawFeatureItem[] | null;
};

// ===== helper =====
const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
};

const mapImages = (value: unknown): ProductImages => {
  const raw = value as RawProductImages | undefined;

  return {
    main: raw?.main?.trim()
      ? raw.main
      : "https://picsum.photos/seed/default/400/300",
    thumbnails: isStringArray(raw?.thumbnails) ? raw!.thumbnails : [],
  };
};

const mapDetailContent = (value: unknown): DetailContent[] => {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    const raw = (item ?? {}) as RawDetailContent;

    return {
      title: typeof raw.title === "string" ? raw.title : "",
      text: isStringArray(raw.text) ? raw.text : [],
    };
  });
};

const mapDetails = (value: unknown): ProductDetail[] => {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    const raw = (item ?? {}) as RawProductDetail;

    return {
      section: typeof raw.section === "string" ? raw.section : "",
      content: mapDetailContent(raw.content),
    };
  });
};

const mapHighlightItems = (value: unknown, productId: string): FeatureItem[] => {
  if (!Array.isArray(value)) return [];

  return value.map((item, index) => {
    const raw = (item ?? {}) as RawFeatureItem;

    return {
      id:
        typeof raw.id === "string" && raw.id.trim()
          ? raw.id
          : `feature-${productId}-${index}`,
      title: typeof raw.title === "string" ? raw.title : "",
      subtitle: typeof raw.subtitle === "string" ? raw.subtitle : undefined,
      icon: typeof raw.icon === "string" ? raw.icon : undefined,
      desc: isStringArray(raw.desc) ? raw.desc : [],
    };
  });
};

const mapHighlights = (value: unknown, productId: string): Highlights => {
  const raw = (value ?? {}) as RawHighlights;

  return {
    title: typeof raw.title === "string" ? raw.title : "",
    description: typeof raw.description === "string" ? raw.description : "",
    items: mapHighlightItems(raw.items, productId),
  };
};

// ===== main mapper =====
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
    images: mapImages(item.images),
    details: mapDetails(item.details),
    highlights: mapHighlights(item.highlights, item.id),
    tags: isStringArray(item.tags) ? item.tags : [],
  };
};