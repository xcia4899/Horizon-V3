// middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  if (!authStore.user) {
    return navigateTo("/auth/login");
  }
});