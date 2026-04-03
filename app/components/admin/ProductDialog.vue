<template>
  <el-dialog
    :model-value="modelValue"
    :title="mode === 'create' ? '新增商品' : '編輯商品'"
    class="product-dialog"
    @close="handleClose"
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
          <el-input-number v-model="form.price" :min="0" class="price-input" />
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
        <el-button class="btn-cancel" @click="handleClose">
          取消
        </el-button>
        <el-button class="btn-submit" type="primary" @click="submitForm">
          {{ mode === "create" ? "新增" : "儲存" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile } from "element-plus";
import type { Product, ProductForm } from "~/types/data/products";
//資料匯入
import { detailPresets } from "@/constants/detailPresets";
import { highlightsPreset } from "@/constants/highlightsPreset";

const props = defineProps<{
  modelValue: boolean;
  mode: "create" | "edit";
  product: Product | null;
  productLength: number;
  tagOptions: { label: string; value: string }[];
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", value: Product): void;
}>();
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
//填入表單
const fillForm = (product: Product) => {
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
  form.details = structuredClone(product.details ?? []);
  form.highlights = structuredClone(
    product.highlights ?? {
      title: "",
      description: "",
      items: [],
    },
  );
  form.tags = [...(product.tags ?? [])];

  mainFileList.value = form.images.main
    ? [{ name: "main-image", url: form.images.main }]
    : [];

  thumbFileList.value = form.images.thumbnails.map((url, index) => ({
    name: `thumb-${index + 1}`,
    url,
  }));
};
//建立時預設ID 流水號
const createDefaultId = () => {
  const number = `10${String(props.productLength + 1).padStart(2, "0")}`;
  form.id = `brand-${number}`;
};
//彈出視窗打開時判斷模式
watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) return;

    resetForm();

    if (props.mode === "create") {
      createDefaultId();
      return;
    }

    if (props.mode === "edit" && props.product) {
      fillForm(props.product);
    }
  },
  { immediate: true },
);
//ID依照品牌名稱自動生成
watch(
  [() => form.brand, () => props.productLength, () => props.mode],
  ([brand, productLength, mode]) => {
    if (!brand || mode !== "create") return;

    const setBrand = brand.trim().toUpperCase().replace(/\s+/g, "-");
    const number = `10${String(productLength + 1).padStart(2, "0")}`;
    form.id = `${setBrand}-${number}`;
  },
);
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
// ProductForm -> Product 轉換用
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

const submitForm = () => {
  const productData = toProduct({ ...form });
  emit("submit", productData);
};

const handleClose = () => {
  emit("update:modelValue", false);
};

</script>

<style scoped lang="scss"></style>
