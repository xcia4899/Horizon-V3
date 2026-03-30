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
  //刪除
  const deleteProduct = async (id:string)=>{
    return await api(`/api/products/${id}`, { method: "DELETE" });
  }
  //重置資料
  const resetProducts = async () => {
    const result = await api<{ data: ProductRow[] }>("/api/products/reset", {
      method: "POST",
    });
    return { data: (result.data ?? []).map(mapProduct) };
  };
  //建立原始資料
  const setSeedProduct = async () =>
    await api("/api/products/seed-products", {
      method: "POST",
    });

  return {
    getProducts,
    resetProducts,
    setSeedProduct,
    deleteProduct
  };
};
