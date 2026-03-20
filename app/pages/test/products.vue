<template>
  <section style="padding: 72px">
    <h1>商品匯入 測試頁</h1>
    <div style="display: flex; gap: 8px">
      <button class="btn" @click="seedProducts">匯入商品資料</button>
      <button class="btn" @click="seedProducts">重製資料</button>
    </div>
    <br />
    <p v-if="pending">資料讀取中...</p>
    <p v-else-if="errorMsg">{{ errorMsg }}</p>

    <ul v-else class="items">
      <li v-for="item in products" :key="item.id" class="item">
        <span>{{ item.id }}</span> <span>{{ item.brand }}</span>
        <span>{{ item.name }}</span> <span> ${{ item.price }}</span>
        <button class="btn">刪除</button>
        <button class="btn">修改</button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
// import type { Database } from "@/types/database.types";
import type { Product } from "~/types/data/products";
//api集中管理
const { getProducts } = useProductsApi();

// type Product = Database["public"]["Tables"]["products"]["Row"];

const products = ref<Product[]>([]);
const pending = ref(false);
const errorMsg = ref("");

const fetchProducts = async () => {
  pending.value = true;
  errorMsg.value = "";
  try {
    // const result = await $fetch("/api/products/");
    const result = await getProducts();
    products.value = result.data ?? [];
  } catch (error: unknown) {
    console.error("讀取 products 失敗：", error);
    if (error instanceof Error) {
      errorMsg.value = error.message;
    } else {
      errorMsg.value = "讀取失敗";
    }
  } finally {
    pending.value = false;
  }
};

const seedProducts = async () => {
  pending.value = true;
  errorMsg.value = "";

  try {
    const result = await $fetch("/api/seed-products", {
      method: "POST",
    });

    console.log("匯入成功", result);

    await fetchProducts();
  } catch (error: unknown) {
    console.error("匯入失敗", error);

    if (error instanceof Error) {
      errorMsg.value = error.message;
    } else {
      errorMsg.value = "匯入失敗";
    }
  } finally {
    pending.value = false;
  }
};
onMounted(fetchProducts);
</script>
<style lang="scss">
.items {
  display: grid;
  gap: 4px;
}
.item {
  display: flex;
  // justify-content: space-between;
  gap: 16px;
  align-items: center;
  border: 1px solid #333;
  padding: 4px 8px;
  span {
    flex: 1;
  }
  .btn {
    width: 60px;
    height: 40px;
    gap: 4px;
  }
}
</style>
