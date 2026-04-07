

<template>
  <main>
    <h1>會員中心</h1>

    <p v-if="userStore.pending">讀取中...</p>
    <p v-else-if="userStore.errorMsg">{{ userStore.errorMsg }}</p>

    <template v-else-if="userStore.profile">
      <p>帳號：{{ userStore.profile.email }}</p>

      <div>
        <label>姓</label>
        <input v-model="form.first_name" type="text" />
      </div>

      <div>
        <label>名</label>
        <input v-model="form.last_name" type="text" />
      </div>

      <div>
        <label>生日</label>
        <input v-model="form.birthday" type="date" />
      </div>

      <button :disabled="pending" @click="submitProfile">
        {{ pending ? "儲存中..." : "儲存資料" }}
      </button>

      <p v-if="successMsg">{{ successMsg }}</p>
      <p v-if="errorMsg">{{ errorMsg }}</p>
    </template>
  </main>
</template>

<script setup lang="ts">
const userStore = useUserStore();

await userStore.fetchMe();

const form = reactive({
  first_name: "",
  last_name: "",
  birthday: "",
});

watchEffect(() => {
  if (!userStore.profile) return;

  form.first_name = userStore.profile.first_name ?? "";
  form.last_name = userStore.profile.last_name ?? "";
  form.birthday = userStore.profile.birthday ?? "";
});

const pending = ref(false);
const successMsg = ref("");
const errorMsg = ref("");

const submitProfile = async () => {
  pending.value = true;
  successMsg.value = "";
  errorMsg.value = "";

  try {
    await $fetch("/api/me", {
      method: "PUT",
      body: {
        first_name: form.first_name,
        last_name: form.last_name,
        birthday: form.birthday || null,
      },
    });

    successMsg.value = "會員資料更新成功";
    await userStore.fetchMe(true);
  } catch (error: unknown) {
    errorMsg.value = error instanceof Error ? error.message : "更新失敗";
  } finally {
    pending.value = false;
  }
};
</script>