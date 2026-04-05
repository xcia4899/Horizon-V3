<template>
  <div class="data-content">
    <div
      class="data-row data-row-head"
      :style="{ gridTemplateColumns: gridColumns }"
    >
      <div v-for="column in tableTitle" :key="column.key">
        {{ column.label }}
      </div>
    </div>

    <div v-if="paginatedItems.length === 0" class="data-empty">
      {{ emptyText || "目前沒有資料" }}
    </div>

    <div v-else class="data-body">
      <slot :items="paginatedItems"></slot>
    </div>
  </div>
  <div class="pagination-container">
    <el-pagination
      v-if="items.length > pageSize"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="items.length"
      size="large"
      layout="prev, pager, next"
      class="pagination"
    />
  </div>
</template>

<script setup lang="ts" generic="T">
export interface AdminColumn {
  key: string;
  label: string;
}

const props = defineProps<{
  tableTitle: AdminColumn[];
  items: T[];
  gridColumns: string;
  emptyText?: string;
}>();
defineSlots<{
  default(props: { items: T[] }): unknown;
}>();

const currentPage = ref(1);
const pageSize = 12;
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return props.items.slice(start, end);
});
</script>

<style scoped lang="scss">
.data-content {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-block: 4px;
  border: 1px solid var(--border-default);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-surface);
}

.data-row {
  display: grid;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-default);

  &-head {
    position: sticky;
    top: 0;
    z-index: 2;
    font-weight: 600;
    background: var(--bg-surface-strong);
  }
}
.data-body {
  min-height: 0;
  // max-height: clamp(400px, 76dvh, 900px);
  overflow-y: auto;
}
.data-empty {
  padding: 32px;
  text-align: center;
  color: var(--text-secondary);
}
.pagination-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  .el-pagination {
    gap: 12px;
    :deep(.el-pager) {
      gap: 8px;
      li {
        background: var(--bg-surface);
      }
    }
    :deep(button) {
      background-color: var(--bg-surface);
    }
  }
}

@media (max-width: 768px) {
  .data-content {
    border: 0;
    background: transparent;
  }

  .data-row-head {
    display: none;
  }

  .data-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  :deep(.data-row),
  :deep(.page-content-data-item) {
    grid-template-columns: 1fr !important;
    gap: 10px;
    padding: 12px;
    border: 1px solid var(--border-default);
    border-radius: 12px;
    background: var(--bg-surface);
    border-bottom: 0;
  }

  :deep(.data-cell) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  :deep(.data-cell::before) {
    content: attr(data-label);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  :deep(.actions) {
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
  }

  :deep(.actions::before) {
    display: none;
  }
}
</style>
