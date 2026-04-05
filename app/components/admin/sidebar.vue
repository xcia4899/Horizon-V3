<template>
  <aside class="admin-sidebar">
    <div class="sidebar-head" @click="goToAdmin">
      <h2>Admin Panel</h2>
      <p>內容管理 | 說明 | 首頁</p>
    </div>

    <nav class="sidebar-nav">
      <NuxtLink to="/admin/home" class="sidebar-item" active-class="is-active">
        Home
      </NuxtLink>

      <NuxtLink
        to="/admin/products"
        class="sidebar-item"
        active-class="is-active"
      >
        Products
      </NuxtLink>

      <NuxtLink
        to="/admin/banner"
        class="sidebar-item"
        active-class="is-active"
      >
        Banner
      </NuxtLink>

      <NuxtLink
        to="/admin/orders"
        class="sidebar-item"
        active-class="is-active"
      >
        訂單資訊
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const goToAdmin = () => {
  navigateTo("/admin");
};
</script>

<style scoped lang="scss">
.admin-sidebar {
  position: sticky;
  top: 0;
  // min-height: 100vh;
  // height: 100%;
  padding: 20px 16px;
}

.sidebar-head {
  margin-bottom: 24px;
  padding: 8px 8px 16px;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-default);
  cursor: pointer;
  * {
    cursor: pointer;
  }
  h2 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  p {
    font-size: 13px;
    color: var(--bg-tertiary);
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .sidebar-item {
    display: block;
    width: 100%;
    padding: 14px 16px;
    border-radius: 12px;
    background: transparent;
    color: var(--text-primary);
    text-decoration: none;
    user-select: none;
    font-weight: 600;

    transition:
      background-color 0.25s ease,
      color 0.25s ease,
      transform 0.25s ease,
      box-shadow 0.25s ease;
    &:hover {
      background: rgba($color-gray-600, 0.18);
      color: var(--text-primary);
      transform: translateX(2px);
    }

    &.is-active {
      background: var(--bg-surface-contrast);
      color: var(--text-inverse);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
    }
  }
  @media (max-width: 600px) {
    flex-direction: row;
    flex-wrap: wrap;
     gap: 8px;
    .sidebar-item{
      width: calc(32% - 5px);
      padding: 12px 16px;
    }
  }
}
</style>
