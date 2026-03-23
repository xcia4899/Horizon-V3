import type { Database } from "@/types/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

// interface ProductsResponse {
//   data: Product[];
// }
export const useProductsApi = () => {
  const api = useApi();
  //讀取
  const getProducts = async () => {
    const result = await api<{ data: ProductRow[] }>("/api/products", {
      method: "GET",
    });
    return {
      data: (result.data ?? []).map(mapProduct),
    };
  };

  //重置
  const resetProducts = async () => {
    const result = await api<{ data: ProductRow[] }>("/api/products/reset", {
      method: "POST",
    });
    return { data: (result.data ?? []).map(mapProduct) };
  };
  //建立資料
  const setSeedProduct = async () =>
    await api("/api/products/seed-products", {
      method: "POST",
    });

  return {
    getProducts,
    resetProducts,
    setSeedProduct,
  };
};
