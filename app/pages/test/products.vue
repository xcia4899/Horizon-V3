<template>
  <div style="padding: 72px">
    <section>
      <div>
        <h1>商品匯入 測試頁</h1>
        <div style="display: flex; gap: 8px">
          <button class="btn" @click="seedProducts">匯入商品資料</button>
          <button class="btn" @click="resetProducts">重製資料</button>
          <button class="btn" @click="creatProduct">新增資料</button>
        </div>
        <div class="total">共{{ products.length }}筆</div>
      </div>
      <br />
      <p v-if="errorMsg">{{ errorMsg }}</p>
      <p v-if="pending">資料更新中...</p>

      <ul v-else class="items">
        <li v-for="item in products" :key="item.id" class="item">
          <span>{{ item.id }}</span> <span>{{ item.brand }}</span>
          <span>{{ item.name }}</span> <span> ${{ item.price }}</span
          ><span> {{ item.category }}</span
          ><span v-if="item.details"> {{ item.category }}細項</span>
          <button class="btn" @click="deleteProduct(item.id)">刪除</button>
          <button class="btn" @click="editProduct(item)">編輯</button>
        </li>
      </ul>
    </section>
    <el-dialog
      v-model="dialogVisible"
      :title="mode === 'create' ? '新增商品' : '編輯商品'"
      width="500"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="ID">
          <el-input
            v-model="form.id"
            disabled
            :value="`${form.brand}-${productLength}`"
          />
        </el-form-item>

        <el-form-item label="名稱">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item v-if="mode === 'create'" label="相片">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="品牌">
          <el-input v-model="form.brand" />
        </el-form-item>

        <el-form-item label="價格">
          <el-input-number v-model="form.price" :min="0" />
        </el-form-item>

        <el-form-item label="類型">
          <el-select
            v-model="form.category"
            placeholder="選擇種類"
            style="width: 115px"
          >
            <el-option label="滑鼠" value="滑鼠" />
            <el-option label="鍵盤" value="鍵盤" />
            <el-option label="耳機" value="耳機" />
            <el-option label="麥克風" value="麥克風" />
            <el-option label="喇叭" value="喇叭" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">
          {{ mode === "create" ? "新增" : "儲存" }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// import type { Database } from "@/types/database.types";
import { ref, reactive } from "vue";
import type { Product, ProductForm } from "~/types/data/products";
import { ElMessage } from "element-plus";
import { detailPresets } from "@/constants/detailPresets";
//api集中管理
const useProducts = useProductsApi();

// type Product = Database["public"]["Tables"]["products"]["Row"];

const products = ref<Product[]>([]);
const productLength = computed(
  () => `10${String(products.value.length + 1).padStart(2, "0")}`,
);
const pending = ref(false);
const errorMsg = ref("");

const dialogVisible = ref(false);
const mode = ref<"create" | "edit">("create");

const form = reactive<ProductForm>({
  id: "",
  name: "",
  images: { main: "", thumbnails: [] },
  brand: "",
  price: 0,
  discount: 0,
  onsale: false,
  category: "",
  details: [],
});
const resetForm = () => {
  form.id = "";
  form.name = "";
  form.brand = "";
  form.price = 0;
  form.discount = 0;
  form.onsale = false;
  form.category = "";
  form.details = [];
};

const creatProduct = () => {
  mode.value = "create";
  resetForm();
  dialogVisible.value = true;
};
const editProduct = (product: ProductForm) => {
  mode.value = "edit";
  form.id = product.id;
  form.name = product.name;
  form.brand = product.brand;
  form.price = product.price;
  form.discount = product.discount;
  form.onsale = product.onsale;
  form.category = product.category;
  dialogVisible.value = true;
};
const toProduct = (form: ProductForm): Product => {
  return {
    subtitle: "",
    color: "",
    description: "",
    highlights: {
      title: "",
      description: "",
      items: [],
    },

    tags: [],
    ...form,
  };
};
const submitForm = async () => {
  try {
    if (mode.value === "create") {
      // await useProductsApi().createProduct({ ...form })
      products.value.push(toProduct(form));
    } else {
      // await useProductsApi().updateProduct({ ...form })
      products.value = products.value.map((item) =>
        item.id === form.id ? toProduct(form) : item,
      );
    }

    dialogVisible.value = false;
    resetForm();
  } catch (error: unknown) {
    if (error instanceof Error) ElMessage.error("送出失敗");
  }
};
watch(
  () => form.category,
  (val) => {
    if (!val) return;
    // if (!detailPresets) return;
    console.log(val);
    console.log(detailPresets[val]);
    form.details = structuredClone(detailPresets[val] ?? []);
  },
);

const fetchProducts = async () => {
  pending.value = true;
  errorMsg.value = "";
  try {
    const result = await useProducts.getProducts();
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
onMounted(fetchProducts);

const seedProducts = async () => {
  pending.value = true;
  errorMsg.value = "";
  try {
    await useProducts.setSeedProduct();
    console.log("匯入成功");
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
const resetProducts = async () => {
  pending.value = true;
  errorMsg.value = "";
  try {
    await useProducts.resetProducts();
    await fetchProducts();
  } catch (error: unknown) {
    console.error("重置失敗", error);

    if (error instanceof Error) {
      errorMsg.value = error.message;
    } else {
      errorMsg.value = "重置失敗";
    }
  } finally {
    pending.value = false;
  }
};
const deleteProduct = async (id: string) => {
  pending.value = true;
  errorMsg.value = "";
  try {
    await useProducts.deleteProduct(id);
    products.value = products.value.filter((p) => p.id !== id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMsg.value = error.message;
    } else {
      errorMsg.value = "刪除失敗";
    }
  } finally {
    pending.value = false;
  }
};
</script>
<style lang="scss">
.total {
  text-align: right;
}
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
