<template>
  <div style="padding: 72px">
    <section>
      <div>
        <h1>商品匯入 測試頁</h1>

        <div style="display: flex; gap: 8px">
          <button class="btn" @click="fetchProducts">刷新資料列表</button>
          <button class="btn" @click="seedProducts">重製基本資料</button>
          <button class="btn" @click="resetProducts">全部重製</button>
          <button class="btn" @click="createProduct">新增資料</button>
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
          <button class="btn" @click="editProduct(item)">編輯</button>
        </li>
      </ul>
    </section>

    <el-dialog
      v-model="dialogVisible"
      :title="mode === 'create' ? '新增商品' : '編輯商品'"
      class="product-dialog"
      @closed="resetForm"
    >
      <el-form :model="form" label-width="80px" class="product-form">
        <el-form-item label="ID" class="form-item form-item-id">
          <el-input v-model="form.id" disabled class="form-input" />
        </el-form-item>

        <el-form-item label="品牌" class="form-item form-item-brand">
          <el-input v-model="form.brand" class="form-input" />
        </el-form-item>

        <el-form-item label="名稱" class="form-item form-item-name">
          <el-input v-model="form.name" class="form-input" />
        </el-form-item>

        <el-form-item label="輔助標題" class="form-item form-item-subtitle">
          <el-input v-model="form.subtitle" class="form-input" />
        </el-form-item>

        <el-form-item label="價格" class="form-item form-item-price">
          <div class="price-group">
            <span class="price-label">原價:</span>
            <el-input-number
              v-model="form.price"
              :min="0"
              class="price-input"
            />
            <span class="price-label">特價:</span>
            <el-input-number
              v-model="form.discount"
              :min="0"
              class="price-input"
            />
          </div>

          <el-switch
            v-model="form.onsale"
            active-text="有折扣"
            inactive-text="無折扣"
            class="price-switch"
          />
        </el-form-item>

        <el-form-item label="主要圖片" class="form-item upload-images">
          <el-upload
            v-model:file-list="mainFileList"
            class="upload upload-main"
            list-type="picture-card"
            :auto-upload="false"
            :multiple="false"
            :limit="1"
            :on-remove="handleMainRemove"
            :on-change="handleMainChange"
          >
            <el-icon class="upload-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="輔助圖片" class="form-item upload-images">
          <el-upload
            v-model:file-list="thumbFileList"
            class="upload upload-thumb"
            list-type="picture-card"
            :auto-upload="false"
            :multiple="true"
            :limit="4"
            :on-remove="handleThumbRemove"
            :on-change="handleThumbChange"
          >
            <el-icon class="upload-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="敘述" class="form-item form-item-description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="請輸入商品敘述"
            class="form-textarea"
          />
        </el-form-item>

        <el-form-item label="類型" class="form-item form-item-category">
          <el-select
            v-model="form.category"
            placeholder="選擇種類"
            class="form-select"
          >
            <el-option label="滑鼠" value="滑鼠" />
            <el-option label="鍵盤" value="鍵盤" />
            <el-option label="耳機" value="耳機" />
            <el-option label="麥克風" value="麥克風" />
            <el-option label="喇叭" value="喇叭" />
          </el-select>
        </el-form-item>

        <el-form-item label="TAG" class="form-item form-item-tags">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="2"
            placeholder="可多選TAG"
            class="form-select form-select-tags"
          >
            <el-option
              v-for="item in tagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button class="btn-cancel" @click="dialogVisible = false">
            取消
          </el-button>
          <el-button class="btn-submit" type="primary" @click="submitForm">
            {{ mode === "create" ? "新增" : "儲存" }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile } from "element-plus";

import type { Product, ProductForm } from "~/types/data/products";
import { detailPresets } from "@/constants/detailPresets";
import { highlightsPreset } from "@/constants/highlightsPreset";
import { useTags } from "@/composables/useTags";
import type { SidebarList } from "~/types/ui/sidebar";

// API
const useProducts = useProductsApi();

// 商品列表
const products = ref<Product[]>([]);
const pending = ref(false);
const errorMsg = ref("");
const tagSource = ref<SidebarList[]>(useTags());

// 流水號
const productLength = computed(
  () => `10${String(products.value.length + 1).padStart(2, "0")}`,
);

// 表單狀態
const dialogVisible = ref(false);
const mode = ref<"create" | "edit">("create");

// upload file list
const mainFileList = ref<UploadUserFile[]>([]);
const thumbFileList = ref<UploadUserFile[]>([]);
//表單
const form = reactive<ProductForm>({
  id: "",
  name: "",
  brand: "",
  subtitle: "",
  category: "",
  price: 0,
  discount: 0,
  onsale: false,
  color: "",
  description: "",
  images: {
    main: "",
    thumbnails: [],
  },
  details: [],
  highlights: structuredClone(highlightsPreset),
  tags: [],
});

// 重設表單
const resetForm = () => {
  form.id = "";
  form.name = "";
  form.brand = "";
  form.subtitle = "";
  form.category = "";
  form.price = 0;
  form.discount = 0;
  form.onsale = false;
  form.color = "";
  form.description = "";

  form.images.main = "";
  form.images.thumbnails = [];

  form.details = [];

  form.highlights = {
    title: "",
    description: "",
    items: [],
  };

  form.tags = [];

  mainFileList.value = [];
  thumbFileList.value = [];
};

// 開啟新增
const createProduct = () => {
  mode.value = "create";
  resetForm();
  form.id = `brand-${productLength.value}`;
  dialogVisible.value = true;
};
//ID依照品牌名稱自動生成
watch([() => form.brand, () => productLength.value], ([brand, length]) => {
  if (!brand || mode.value !== "create") return;
  const setBrand = brand.trim().toUpperCase().replace(/\s+/g, "-");
  const number = String(length).padStart(2, "0");
  form.id = `${setBrand}-${number}`;
});
// 開啟編輯
const editProduct = (product: Product) => {
  mode.value = "edit";
  form.id = product.id;
  form.name = product.name;
  form.brand = product.brand;
  form.subtitle = product.subtitle ?? "";
  form.category = product.category;
  form.price = product.price;
  form.discount = product.discount ?? 0;
  form.onsale = product.onsale ?? false;
  form.color = product.color ?? "";
  form.description = product.description ?? "";
  form.images = {
    main: product.images?.main ?? "",
    thumbnails: [...(product.images?.thumbnails ?? [])],
  };
  form.details = JSON.parse(JSON.stringify(product.details ?? []));
  form.highlights = JSON.parse(
    JSON.stringify(
      product.highlights ?? {
        title: "",
        description: "",
        items: [],
      },
    ),
  );
  form.tags = [...(product.tags ?? [])];
  mainFileList.value = form.images.main
    ? [{ name: "main-image", url: form.images.main }]
    : [];
  thumbFileList.value = form.images.thumbnails.map((url, index) => ({
    name: `thumb-${index + 1}`,
    url,
  }));

  dialogVisible.value = true;
};

// 主圖：移除
const handleMainRemove: UploadProps["onRemove"] = () => {
  form.images.main = "";
  mainFileList.value = [];
};
// 主圖：變更
const handleMainChange: UploadProps["onChange"] = (uploadFile) => {
  if (uploadFile.raw && !uploadFile.url) {
    uploadFile.url = URL.createObjectURL(uploadFile.raw);
  }
  form.images.main = uploadFile.url ?? "";
  mainFileList.value = uploadFile.url
    ? [{ name: uploadFile.name, url: uploadFile.url }]
    : [];
};
// 縮圖：移除
const handleThumbRemove: UploadProps["onRemove"] = (
  _uploadFile,
  uploadFiles,
) => {
  form.images.thumbnails = uploadFiles
    .map((file) => file.url)
    .filter((url): url is string => !!url);
};
// 縮圖：變更
const handleThumbChange: UploadProps["onChange"] = (
  uploadFile,
  uploadFiles,
) => {
  if (uploadFile.raw && !uploadFile.url) {
    uploadFile.url = URL.createObjectURL(uploadFile.raw);
  }

  form.images.thumbnails = uploadFiles
    .map((file) => file.url)
    .filter((url): url is string => !!url);
};

// ProductForm -> Product
const toProduct = (formData: ProductForm): Product => {
  return {
    ...form,
    images: {
      main: formData.images.main,
      thumbnails: [...formData.images.thumbnails],
    },

    details: formData.details.map((detail) => ({
      section: detail.section,
      content: detail.content.map((content) => ({
        title: content.title,
        text: [...content.text],
      })),
    })),

    highlights: {
      title: formData.highlights.title,
      description: formData.highlights.description,
      items: formData.highlights.items.map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle ?? "",
        icon: item.icon ?? "",
        desc: [...(item.desc ?? [])],
      })),
    },

    tags: [...formData.tags],
  };
};
// 送出-呼叫API
const submitForm = async () => {
  try {
    const productData = toProduct({ ...form });
    const serverData = toProductInsert(productData);

    if (mode.value === "create") {
      await useProducts.createProduct(serverData);
      products.value.push(productData);
      ElMessage.success("新增成功");
    } else {
      await useProducts.updateProduct(form.id, serverData);
      products.value = products.value.map((item) =>
        item.id === form.id ? productData : item,
      );
      ElMessage.success("更新成功");
    }

    dialogVisible.value = false;
    resetForm();
  } catch (error: unknown) {
    console.error("送出失敗：", error);
    ElMessage.error("送出失敗");
  }
};

// category 改變時，自動帶入 details preset
watch(
  () => form.category,
  (val) => {
    if (!val) {
      form.details = [];
      return;
    }

    form.details = structuredClone(detailPresets[val] ?? []);
  },
);
// 添加tag-------
const tagOptions = computed(() => {
  return tagSource.value
    .filter((item: SidebarList) => item.key !== "price" && item.key !== "brand")
    .flatMap((item) => item.options)
    .map((option) => ({
      label: String(option.label),
      value: String(option.value),
    }));
});

/* ------使用API------- */
// 讀取商品
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

// 匯入種子資料
const seedProducts = async () => {
  pending.value = true;
  errorMsg.value = "";

  try {
    await useProducts.setSeedProduct();
    ElMessage.success("匯入成功");
    await fetchProducts();
  } catch (error: unknown) {
    console.error("匯入失敗：", error);

    if (error instanceof Error) {
      errorMsg.value = error.message;
    } else {
      errorMsg.value = "匯入失敗";
    }
  } finally {
    pending.value = false;
  }
};

// 重製資料
const resetProducts = async () => {
  pending.value = true;
  errorMsg.value = "";

  try {
    await useProducts.resetProducts();
    ElMessage.success("重製成功");
    await fetchProducts();
  } catch (error: unknown) {
    console.error("重置失敗：", error);

    if (error instanceof Error) {
      errorMsg.value = error.message;
    } else {
      errorMsg.value = "重置失敗";
    }
  } finally {
    pending.value = false;
  }
};

// 刪除商品
const deleteProduct = async (id: string) => {
  pending.value = true;
  errorMsg.value = "";

  try {
    await useProducts.deleteProduct(id);
    products.value = products.value.filter((p) => p.id !== id);
    ElMessage.success("刪除成功");
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
