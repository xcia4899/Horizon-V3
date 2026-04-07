// plugins/init-user.client.ts
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  watch(
    () => authStore.user,
    async (user) => {
      if (user) {
        await userStore.fetchMe();
      } else {
        userStore.clearUser();
      }
    },
    { immediate: true },
  );
});