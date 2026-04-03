import { defineStore } from "pinia";
import { ref } from "vue";
import type { Product } from "~/types/data/products";

export const useProductsStore = defineStore("products", () => {
  const productsApi = useProductsApi();

  const products = ref<Product[]>([]);
  const pending = ref(false);
  const errorMsg = ref("");

  const fetchProducts = async () => {
    pending.value = true;
    errorMsg.value = "";

    try {
      const result = await productsApi.getProducts();
      products.value = result.data ?? [];
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMsg.value = error.message;
      } else {
        errorMsg.value = "讀取失敗";
      }
    } finally {
      pending.value = false;
    }
  };

  const fetchProductById = async (id: string) => {
    pending.value = true;
    errorMsg.value = "";

    try {
      const result = await productsApi.getProduct(id);
      return result.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMsg.value = error.message;
      } else {
        errorMsg.value = "讀取單筆失敗";
      }
      return null;
    } finally {
      pending.value = false;
    }
  };

  const createProduct = async (productData: Product) => {
    pending.value = true;
    errorMsg.value = "";

    try {
      const serverData = toProductInsert(productData);
      await productsApi.createProduct(serverData);

      products.value.push(productData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMsg.value = error.message;
      } else {
        errorMsg.value = "新增失敗";
      }
      throw error;
    } finally {
      pending.value = false;
    }
  };

  const updateProduct = async (id: string, productData: Product) => {
    pending.value = true;
    errorMsg.value = "";

    try {
      const serverData = toProductInsert(productData);
      await productsApi.updateProduct(id, serverData);

      products.value = products.value.map((item) =>
        item.id === id ? productData : item,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMsg.value = error.message;
      } else {
        errorMsg.value = "更新失敗";
      }
      throw error;
    } finally {
      pending.value = false;
    }
  };

  const deleteProduct = async (id: string) => {
    pending.value = true;
    errorMsg.value = "";

    try {
      await productsApi.deleteProduct(id);
      products.value = products.value.filter((item) => item.id !== id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMsg.value = error.message;
      } else {
        errorMsg.value = "刪除失敗";
      }
      throw error;
    } finally {
      pending.value = false;
    }
  };

  const resetProducts = async () => {
    pending.value = true;
    errorMsg.value = "";

    try {
      const result = await productsApi.resetProducts();
      products.value = result.data ?? [];
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMsg.value = error.message;
      } else {
        errorMsg.value = "重置失敗";
      }
      throw error;
    } finally {
      pending.value = false;
    }
  };

  const seedProducts = async () => {
    pending.value = true;
    errorMsg.value = "";

    try {
      await productsApi.setSeedProduct();
      await fetchProducts();
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMsg.value = error.message;
      } else {
        errorMsg.value = "匯入失敗";
      }
      throw error;
    } finally {
      pending.value = false;
    }
  };

  return {
    products,
    pending,
    errorMsg,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    seedProducts,
  };
});