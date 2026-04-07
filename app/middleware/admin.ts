export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  if (!authStore.user) {
    return navigateTo("/auth/login");
  }

  if (!userStore.profile) {
    try {
      await userStore.fetchMe();
    } catch {
      return navigateTo("/");
    }
  }

  if (userStore.profile?.role !== "admin") {
    return navigateTo("/");
  }
});