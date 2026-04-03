<template>
  <div class="admin-page">
    <header class="page-header">
      <AdminPageHeader title="商品管理" desc="管理網站商品資料" />
      <div class="page-header-actions">
        <button class="admin-btn" @click="fetchProducts">刷新資料列表</button>
        <button class="admin-btn" @click="seedProducts">基本資料重製</button>
        <button class="admin-btn" @click="resetProducts">全部刪除重製</button>
      </div>
    </header>

    <button class="admin-btn add-btn" @click="openCreateDialog">
      新增商品
    </button>
    <p v-if="errorMsg">{{ errorMsg }}</p>
    <p v-if="pending">資料更新中...</p>
    <main v-else class="page-content">
      <AdminDataList
        :tableTitle="tableTitle"
        :items="products"
        :grid-columns="gridColumns"
        empty-text="目前沒有商品資料"
      >
        <template #default="{ items }">
          <div
            v-for="item in items"
            :key="item.id"
            class="page-content-data-item"
            :style="{ gridTemplateColumns: gridColumns }"
          >
            <div>{{ item.id }}</div>
            <div>{{ item.brand }}</div>
            <div>{{ item.name }}</div>
            <div>${{ item.price.toLocaleString() }}</div>
            <div>{{ item.onsale ? "O" : "X" }}</div>
            <div>{{ item.category }}</div>
            <div class="actions">
              <button class="admin-btn" @click="openDetailDialog(item)">
                詳細
              </button>
              <button class="admin-btn edit-btn" @click="openEditDialog(item)">
                編輯
              </button>

              <button
                class="admin-btn delete-btn"
                @click="deleteProduct(item.id)"
              >
                刪除
              </button>
            </div>
          </div>
        </template>
      </AdminDataList>
    </main>
    <!-- 商品新增編輯 -->
    <AdminProductDialog
      v-model="dialogVisible"
      :mode="mode"
      :product="currentProduct"
      :product-length="products.length"
      :tag-options="tagOptions"
      @submit="handleSubmit"
    />
    <AdminProductDetailDialog
      v-model="detailDialogVisible"
      :product="currentProduct"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import type { Product } from "~/types/data/products";
import { useTagOptions } from "@/composables/useTags";

definePageMeta({
  layout: "admin",
});

//商品pinia
const productsStore = useProductsStore();
const { products, pending, errorMsg } = storeToRefs(productsStore);

interface AdminColumn {
  key: string;
  label: string;
}
const tableTitle: AdminColumn[] = [
  { key: "id", label: "ID" },
  { key: "brand", label: "品牌" },
  { key: "name", label: "商品名稱" },
  { key: "price", label: "價格" },
  { key: "onsale", label: "折扣" },
  { key: "category", label: "分類" },
  { key: "actions", label: "操作" },
];
const gridColumns = computed(() => " 1fr 1fr 2fr 1fr 1fr 1fr 2fr");

// 表單狀態
const detailDialogVisible = ref(false);
const dialogVisible = ref(false);
const mode = ref<"create" | "edit" >("create");
const currentProduct = ref<Product | null>(null);

// 開啟詳細
const openDetailDialog = (product: Product) => {
  
  currentProduct.value = product;
  detailDialogVisible.value = true;
  console.log("openDetailDialog", product,mode.value);
};
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
    }
    if (mode.value === "edit") {
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
    await ElMessageBox.confirm("確定要刪除這筆資料嗎？", "提示");
  } catch {
    ElMessage.info("已取消刪除");
    return;
  }

  try {
    await productsStore.deleteProduct(id);
    ElMessage.success("已刪除");
  } catch (error) {
    console.error("刪除失敗：", error);
    ElMessage.error("刪除失敗");
  }
};

onMounted(fetchProducts);
</script>

<style scoped lang="scss">
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 24px;

  color: var(--text-primary);
}
.page-header {
  display: grid;
  .page-header-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

.page-content {
  flex: 1;
  display: grid;
  gap: 8px;
  min-height: 0;

  .page-content-data-item {
    display: grid;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border-default);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: var(--bg-surface-soft);
    }
  }
}

.add-btn {
  color: $color-white;
  background: var(--brand);
  width: 100%;
  border: 2px solid transparent;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: var(--border-soft);
    }
  }
}

.actions {
  display: flex;
  gap: 8px;

  .edit-btn {
    border-radius: 10px;
  }
  .delete-btn {
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: var(--state-danger);
        border-color: var(--state-danger);
      }
    }
  }
}
</style>
