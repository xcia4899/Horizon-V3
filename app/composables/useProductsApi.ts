import type { Database } from "@/types/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
// interface ProductsResponse {
//   data: Product[];
// }
export const useProductsApi = () => {
  const api = useApi();
  //查詢全部
  const getProducts = async () => {
    const result = await api<{ data: ProductRow[] }>("/api/products", {
      method: "GET",
    });
    return {
      data: (result.data ?? []).map(mapProduct),
    };
  };
  //查詢單筆
  const getProduct = async (id: string) => {
    const result = await api<{ data: ProductRow }>(`/api/products/${id}`, {
      method: "GET",
    });

    return {
      data: result.data ? mapProduct(result.data) : null,
    };
  };
  //新增資料
  const createProduct = async (body: ProductInsert) => {
    return await api("/api/products", {
      method: "POST",
      body,
    });
  };
  const updateProduct = async (id: string, body: ProductUpdate) => {
    return await api(`/api/products/${id}`, {
      method: "PUT",
      body,
    });
  };

  //刪除
  const deleteProduct = async (id: string) => {
    return await api(`/api/products/${id}`, { method: "DELETE" });
  };
  //重置資料
  const resetProducts = async () => {
    const result = await api<{ data: ProductRow[] }>("/api/products/reset", {
      method: "POST",
    });
    return { data: (result.data ?? []).map(mapProduct) };
  };
  //建立原始資料
  const setSeedProduct = async () => {
    await api("/api/products/seed", {
      method: "POST",
    });
  };

  return {
    getProduct,
    getProducts,
    resetProducts,
    setSeedProduct,
    deleteProduct,
    createProduct,
    updateProduct,
  };
};
