import type { Database } from "@/types/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

// interface ProductsResponse {
//   data: Product[];
// }
export const useProductsApi = () => {
  const api = useApi();

  const getProducts = async () => {
    const result = await api<{ data: ProductRow[] }>("/api/products");

    return {
      data: (result.data ?? []).map(mapProduct),
    };
  };

  return {
    getProducts,
  };
};
