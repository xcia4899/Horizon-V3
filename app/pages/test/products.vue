<template>
  <div style="padding: 72px">
    <section>
      <div>
        <h1>商品匯入 測試頁</h1>

        <div style="display: flex; gap: 8px">
          <button class="btn" @click="fetchProducts">刷新資料列表</button>
          <button class="btn" @click="seedProducts">重製基本資料</button>
          <button class="btn" @click="resetProducts">全部重製</button>
          <button class="btn" @click="openCreateDialog">新增資料</button>
        </div>

        <div class="total">共 {{ products.length }} 筆</div>
      </div>

      <br />

      <p v-if="errorMsg">{{ errorMsg }}</p>
      <p v-if="pending">資料更新中...</p>

      <ul v-else class="items">
        <li class="form-item">
          <span>ID</span>
          <span style="width: 60px">大圖</span>
          <span style="width: 40px">小圖</span>

          <span>brand</span>
          <span>name</span>
          <span>price</span>
          <span>category</span>
          <span>description</span>
          <span>details</span>
          <span>highlights</span>
          <span>Tags</span>

          <button class="btn">刪除</button>
          <button class="btn">編輯</button>
        </li>
        <li v-for="item in products" :key="item.id" class="form-item">
          <span>{{ item.id }}</span>
          <img :src="item.images.main" style="width: 60px" />
          <img
            v-if="item.images.thumbnails?.[0]"
            :src="item.images.thumbnails[0]"
            style="width: 40px"
          />
          <span>{{ item.brand }}</span>
          <span>{{ item.name }}</span>
          <span>${{ item.price }}</span>
          <span>{{ item.category }}</span>
          <span v-if="item.description">true</span>
          <span v-if="item.details?.length">true</span>
          <span v-if="item.highlights">true</span>
          <span v-if="item.tags?.length">true</span>

          <button class="btn" @click="deleteProduct(item.id)">刪除</button>
          <button class="btn" @click="openEditDialog(item)">編輯</button>
        </li>
      </ul>
    </section>

    <ProductDialog
      v-model="dialogVisible"
      :mode="mode"
      :product="currentProduct"
      :product-length="products.length"
      :tag-options="tagOptions"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";

import type { Product } from "~/types/data/products";


import { useTagOptions } from "@/composables/useTags";


//商品pinia
const productsStore = useProductsStore();
const { products, pending, errorMsg } = storeToRefs(productsStore);



// 表單狀態
const dialogVisible = ref(false);
const mode = ref<"create" | "edit">("create");
const currentProduct = ref<Product | null>(null);


// 開啟新增
const openCreateDialog = () => {
  mode.value = "create";
  currentProduct.value = null;
  dialogVisible.value = true;
};
// 開啟編輯
const openEditDialog = (product: Product) => {
  mode.value = "edit";
  currentProduct.value = product;
  dialogVisible.value = true;
};


// 添加tag-------
const tagOptions = computed(() => useTagOptions());

// 表單送出 submit
const handleSubmit = async (productData: Product) => {
  try {
    if (mode.value === "create") {
      await productsStore.createProduct(productData);
      ElMessage.success("新增成功");
    } else {
      await productsStore.updateProduct(productData.id, productData);
      ElMessage.success("更新成功");
    }

    dialogVisible.value = false;
  } catch (error: unknown) {
    console.error("送出失敗：", error);
    ElMessage.error("送出失敗");
  }
};

/* ------使用API------- */

// 讀取商品
const fetchProducts = async () => {
  await productsStore.fetchProducts();
};

// 匯入種子資料
const seedProducts = async () => {
  try {
    await productsStore.seedProducts();
    ElMessage.success("匯入成功");
  } catch (error) {
    console.error("匯入失敗：", error);
    ElMessage.error("匯入失敗");
  }
};

// 重製資料
const resetProducts = async () => {
  try {
    await productsStore.resetProducts();
    ElMessage.success("重置成功");
  } catch (error) {
    console.error("重置失敗：", error);
    ElMessage.error("重置失敗");
  }
};

// 刪除商品
const deleteProduct = async (id: string) => {
  try {
    await productsStore.deleteProduct(id);
    ElMessage.success("刪除成功");
  } catch (error) {
    console.error("刪除失敗：", error);
    ElMessage.error("刪除失敗");
  }
};

onMounted(fetchProducts);
</script>

<style lang="scss">
.total {
  text-align: right;
}

.items {
  display: grid;
  gap: 8px;

  .form-item {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    border: 1px solid #333;
    padding: 4px 8px;

    span,
    img {
      flex: 1;
    }

    .btn {
      width: 60px;
      height: 40px;
      gap: 4px;
    }
  }
}

.el-dialog {
  width: min(60%, 760px);
}

.upload-images {
  .el-form-item__content {
    align-items: flex-start;
    gap: 0px 16px;
  }
  .el-upload-list__item-thumbnail,
  .el-upload-list__item {
    max-height: 120px;
    max-width: 120px;
  }

  .el-upload--picture-card {
    max-height: 80px;
    max-width: 80px;
  }

  .el-upload-list__item-preview {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
