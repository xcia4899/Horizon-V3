<template>
  <el-dialog
    :model-value="modelValue"
    title="商品詳情"
    class="product-detail-dialog"
    width="70%"
    @close="handleClose"
  >
    <template v-if="product">
      <div class="detail">
        <section class="detail-hero">
          <div class="detail-gallery">
            <div class="detail-main-image-wrap">
              <img
                :src="product.images.main"
                :alt="product.name"
                class="detail-main-image"
              />
            </div>

            <div
              v-if="product.images.thumbnails?.length"
              class="detail-thumb-list"
            >
              <img
                v-for="(image, index) in product.images.thumbnails"
                :key="`${image}-${index}`"
                :src="image"
                :alt="`${product.name}-${index + 1}`"
                class="detail-thumb-image"
              />
            </div>
          </div>

          <div class="detail-summary">
            <div class="detail-header">
              <h4 class="detail-brand">{{ product.brand }}</h4>
              <h3 class="detail-name">{{ product.name }}</h3>
              <p class="detail-subtitle">
                {{ product.subtitle || "目前沒有輔助標題" }}
              </p>
            </div>

            <div class="detail-meta-card">
              <div class="detail-meta-item">
                <h4 class="detail-label">ID</h4>
                <h4 class="detail-value">{{ product.id }}</h4>
              </div>

              <div class="detail-meta-item">
                <h4 class="detail-label">類型</h4>
                <h4 class="detail-value">{{ product.category }}</h4>
              </div>

              <div class="detail-meta-item">
                <h4 class="detail-label">顏色</h4>
                <h4 class="detail-value">{{ product.color || "-" }}</h4>
              </div>
            </div>
            <div class="detail-meta-card">
              <div class="detail-meta-item">
                <h4 class="detail-label">原價</h4>
                <h4 class="detail-value">
                  NT$ {{ product.price.toLocaleString() }}
                </h4>
              </div>

              <div class="detail-meta-item">
                <h4 class="detail-label">特價</h4>
                <h4 class="detail-value detail-value--discount">
                  {{
                    product.discount
                      ? `NT$ ${product.discount.toLocaleString()}`
                      : "-"
                  }}
                </h4>
              </div>

              <div class="detail-meta-item">
                <h4 class="detail-label">折扣狀態</h4>
                <span
                  class="detail-status"
                  :class="{ 'detail-status--active': product.onsale }"
                >
                  {{ product.onsale ? "有折扣" : "無折扣" }}
                </span>
              </div>
            </div>

            <div class="detail-meta-card">
              <h4 class="detail-section-title">TAG</h4>

              <div v-if="product.tags?.length" class="detail-tag-list">
                <span v-for="tag in product.tags" :key="tag" class="detail-tag">
                  {{ tag }}
                </span>
              </div>

              <p v-else class="detail-text-muted">目前沒有 TAG</p>
            </div>
          </div>
        </section>

        <section class="detail-section">
          <h3 class="detail-section-title">商品描述</h3>
          <p class="detail-text-muted">
            {{ product.description || "目前沒有描述" }}
          </p>
        </section>

        <section class="detail-section">
          <h3 class="detail-section-title">商品詳細內容</h3>

          <div v-if="product.details?.length" class="detail-meta-card-group">
            <div
              v-for="(detailItem, detailIndex) in product.details"
              :key="`${detailItem.section}-${detailIndex}`"
              class="detail-meta-card"
            >
              <h4 class="detail-meta-card-title">
                {{ detailItem.section || `區塊 ${detailIndex + 1}` }}
              </h4>

              <div
                v-for="(content, contentIndex) in detailItem.content"
                :key="`${content.title}-${contentIndex}`"
                class="detail-sub-block"
              >
                <h5 class="detail-sub-title">
                  {{ content.title || `項目 ${contentIndex + 1}` }}
                </h5>

                <ul v-if="content.text?.length" class="detail-list-text">
                  <li
                    v-for="(text, textIndex) in content.text"
                    :key="`${text}-${textIndex}`"
                  >
                    {{ text }}
                  </li>
                </ul>

                <p v-else class="detail-text-muted">目前沒有內容</p>
              </div>
            </div>
          </div>

          <p v-else class="detail-text-muted">目前沒有詳細內容</p>
        </section>

        <section class="detail-section">
          <h3 class="detail-section-title">商品特色</h3>

          <div v-if="product.highlights" class="detail-meta-card-group">
            <div class="detail-meta-card">
              <div class="detail-meta-card-group">
                <h4 class="detail-meta-card-title">
                  {{ product.highlights.title || "未設定標題" }}
                </h4>

                <h5 class="detail-text-muted">
                  {{ product.highlights.description || "目前沒有特色描述" }}
                </h5>
              </div>
              <div
                v-if="product.highlights.items?.length"
                class="detail-sub-block-group"
              >
                <div
                  v-for="(item, index) in product.highlights.items"
                  :key="item.id || index"
                  class="detail-sub-block"
                >
                  <div class="detail-sub-title">
                    {{ item.title || `特色 ${index + 1}` }}
                  </div>

                  <div class="detail-text-muted">
                    {{ item.subtitle || "-" }}
                  </div>

                  <ul v-if="item.desc?.length" class="detail-list-text">
                    <li
                      v-for="(desc, descIndex) in item.desc"
                      :key="`${desc}-${descIndex}`"
                    >
                      {{ desc }}
                    </li>
                  </ul>

                  <p v-else class="detail-text-muted">目前沒有說明</p>
                </div>
              </div>

              <p v-else class="detail-text-muted">目前沒有特色項目</p>
            </div>
          </div>

          <p v-else class="detail-text-muted">目前沒有特色資料</p>
        </section>
      </div>
    </template>

    <template v-else>
      <div class="detail-empty">目前沒有商品資料</div>
    </template>

    <template #footer>
      <div class="detail-footer">
        <el-button type="primary" @click="handleClose">關閉</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Product } from "~/types/data/products";

defineProps<{
  modelValue: boolean;
  product: Product | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const handleClose = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped lang="scss">


.detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: var(--text-primary);

  .detail-hero,
  .detail-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 16px;
    border-radius: 8px;
    background: var(--bg-surface-strong);
  }

  .detail-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .detail-gallery,
  .detail-summary,
  .detail-meta-card-group,
  .detail-sub-block-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .detail-main-image-wrap {
    overflow: hidden;
    border-radius: 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    aspect-ratio: 1 / 1;
  }

  .detail-main-image,
  .detail-thumb-image {
    background: var(--bg-surface);
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .detail-thumb-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
    gap: 12px;
  }

  .detail-thumb-image {
    aspect-ratio: 1 / 1;
    border-radius: 16px;
    border: 1px solid var(--border-default);
  }

  .detail-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-default);
  }

  .detail-brand,
  .detail-subtitle,
  .detail-label,
  .detail-text-muted,
  .detail-list-text {
    color: var(--text-secondary);
  }

  .detail-meta-card {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 16px;
    border-radius: 12px;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
  }

  .detail-meta-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-default);

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }
  }

  .detail-value--discount {
    color: var(--el-color-danger);
  }

  .detail-status,
  .detail-tag {
    padding: 4px 10px;
    border-radius: 32px;
    border: 1px solid var(--border-default);
  }

  .detail-status--active {
    color: var(--el-color-success);
  }

  .detail-tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .detail-tag {
    background: var(--bg-surface-soft);
  }

  .detail-sub-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px dashed var(--border-default);

    &:first-of-type {
      padding-top: 0;
      border-top: none;
    }
  }

  .detail-list-text {
    padding-left: 20px;

    li {
      margin-bottom: 4px;
    }
  }

  .detail-footer {
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: 992px) {
  .detail {
    .detail-hero {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 640px) {
  .detail {
    .detail-meta-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .detail-thumb-list {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
