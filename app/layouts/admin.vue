<template>
  <div class="admin-layout">
    <header class="admin-header">
      <AdminHeader />
    </header>
    <section class="admin-content">
      <aside class="admin-content-sidebar">
        <AdminSidebar />
      </aside>
      <main class="admin-main">
        <slot></slot>
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Horizon-後台",
  ogTitle: "Horizon｜前端電商後台系統實作",
});
</script>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  isolation: isolate;
}
.admin-header {
  //   position: fixed;
  top: 0;
  background: var(--bg-header);
  overflow-x: clip;
  width: 100%;
  z-index: 100;
}
.admin-content {
  flex: 1;
  position: relative;
  display: flex;
  .admin-content-sidebar {
    flex: 0 0 20%;
    position: relative;

    max-width: 200px;
    min-width: 160px;
    background: var(--bg-surface);
    border-right: 2px dotted var(--border-default);
    color: var(--text-primary);
  }
  .admin-main {
    flex: 1;
    position: relative;
    padding: 16px;
    background: var(--bg-surface-soft);
  }
}

@media (max-width: 600px) {
  .admin-content {
    flex-direction: column;
  }

  .admin-content .admin-content-sidebar {
    max-width: none;
    min-width: 0;
    width: 100%;
    border-right: 0;
    border-bottom: 2px dotted var(--border-default);
  }

  .admin-content .admin-main {
    padding: 12px 12px 32px;
  }
}
</style>
