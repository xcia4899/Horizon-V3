<template>
  <main class="member-page ">
    <section class="member-card container">
      <div class="member-card-header">
        <div class="member-card-title-group">
          <h1 class="member-card-title">會員中心</h1>
          <p class="member-card-subtitle">查看與修改您的基本資料</p>
        </div>

        <div v-if="!loading" class="member-card-actions">
          <template v-if="!isEdit">
            <el-button type="primary" @click="handleEdit">編輯資料</el-button>
          </template>

          <template v-else>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" :loading="saving" @click="handleSave">
              儲存資料
            </el-button>
          </template>
        </div>
      </div>

      <div v-loading="loading" class="member-card-body">
        <div class="member-profile">
          <div class="member-profile-avatar">
            {{ fullName.slice(0, 1) }}
          </div>

          <div class="member-profile-info">
            <h2 class="member-profile-name">
              {{
                profile?.last_name || profile?.first_name
                  ? fullName
                  : "未設定姓名"
              }}
            </h2>
            <p class="member-profile-email">
              {{ profile?.email || "無 Email 資料" }}
            </p>
          </div>
        </div>

        <div class="member-form">
          <div class="member-form-row">
            <h4 class="member-form-label">姓</h4>

            <div v-if="!isEdit" class="member-form-value">
              {{ profile?.last_name || "-" }}
            </div>

            <el-input
              v-else
              v-model="form.last_name"
              placeholder="請輸入姓"
              clearable
            />
          </div>

          <div class="member-form-row">
            <h4 class="member-form-label">名</h4>

            <div v-if="!isEdit" class="member-form-value">
              {{ profile?.first_name || "-" }}
            </div>

            <el-input
              v-else
              v-model="form.first_name"
              placeholder="請輸入名"
              clearable
            />
          </div>

          <div class="member-form-row">
            <h4 class="member-form-label">Email</h4>

            <div class="member-form-value">
              {{ profile?.email || "-" }}
            </div>
          </div>

          <div class="member-form-row">
            <h4 class="member-form-label">生日</h4>

            <div v-if="!isEdit" class="member-form-value">
              {{ profile?.birthday || "-" }}
            </div>

            <el-date-picker
              v-else
              v-model="form.birthday"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="請選擇生日"
              class="member-form-date"
            />
          </div>

          <div class="member-form-row">
            <h4 class="member-form-label">角色</h4>

            <div class="member-form-value">
              {{ profile?.role || "user" }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";

interface Profile {
  id: string;
  email: string | null;
  role: string | null;
  first_name: string | null;
  last_name: string | null;
  birthday: string | null;
}

interface MeResponse {
  ok: boolean;
  user: {
    id: string;
    email: string | null;
  };
  profile: Profile | null;
}

const loading = ref(false);
const saving = ref(false);
const isEdit = ref(false);

const profile = ref<Profile | null>(null);

const form = reactive({
  first_name: "",
  last_name: "",
  birthday: "",
});

const fullName = computed(() => {
  const lastName = form.last_name?.trim() ?? "";
  const firstName = form.first_name?.trim() ?? "";
  return `${lastName}${firstName}` || "未設定姓名";
});

const resetForm = () => {
  form.first_name = profile.value?.first_name ?? "";
  form.last_name = profile.value?.last_name ?? "";
  form.birthday = profile.value?.birthday ?? "";
};

const fetchProfile = async () => {
  loading.value = true;

  try {
    const result = await $fetch<MeResponse>("/api/me", {
      method: "GET",
    });

    profile.value = result.profile;
    resetForm();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "會員資料讀取失敗";
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
};

const handleEdit = () => {
  resetForm();
  isEdit.value = true;
};

const handleCancel = () => {
  resetForm();
  isEdit.value = false;
};

const handleSave = async () => {
  saving.value = true;

  try {
    await $fetch("/api/profile", {
      method: "PUT",
      body: {
        first_name: form.first_name,
        last_name: form.last_name,
        birthday: form.birthday || null,
      },
    });

    ElMessage.success("會員資料更新成功");
    await fetchProfile();
    isEdit.value = false;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "會員資料更新失敗";
    ElMessage.error(message);
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});
</script>
<style scoped lang="scss">
.member-page {
  width: 100%;
  padding: 72px 24px;
  background: var(--bg-surface);
}

/* ================= 卡片 ================= */
.member-card {
  padding: 32px;
  display: grid;
  gap: 32px;
}

.member-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  border-bottom: 1px solid var(--border-default);
  padding: 16px;
  .member-card-title-group {
    display: flex;
    flex-direction: column;

    gap: 8px;
    .member-card-title {
      margin: 0;
      color: var(--text-primary);
    }

    .member-card-subtitle {
      margin: 0;
      color: var(--text-secondary);
    }
  }

  .member-card-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }
}

.member-card-body {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ================= 個人資訊 ================= */
.member-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--border-default);
  border-radius: 4px;
  background: var(--bg-surface-soft);
  .member-profile-avatar {
    width: 64px;
    height: 64px;
    font-size: clamp(24px, 8vw, 32px);
    border-radius: 24px;
    display: grid;
    place-items: center;
    border: 1px solid var(--border-default);
    background: var(--bg-surface);
    color: var(--text-primary);
    font-weight: 700;
  }

  .member-profile-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
}

.member-profile-name {
  margin: 0;
  color: var(--text-primary);
}

.member-profile-email {
  margin: 0;
  color: var(--text-secondary);
  word-break: break-all;
}

/* ================= 表單 ================= */
.member-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.member-form-row {
  display: grid;
  grid-template-columns: 96px 1fr;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid var(--border-default);
  border-radius: 4px;
  background: var(--bg-surface-soft);
}

.member-form-label {
  margin: 0;
  color: var(--text-secondary);
}

.member-form-value {
  color: var(--text-primary);
  min-height: 24px;
  display: flex;
  align-items: center;
  word-break: break-word;
}

.member-form-date {
  width: 100%;
}

/* ================= RWD ================= */
@media (max-width: 768px) {
  .member-page {
    padding: 72px 32px;
  }

  .member-card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .member-card-actions {
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .member-form-row {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
}
</style>
