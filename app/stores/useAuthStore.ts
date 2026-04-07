// stores/useAuthStore.ts
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user = useSupabaseUser();
  const loading = ref(false);
  const errorMsg = ref("");

  const authApi = useAuthApi();

  // 註冊
  const register = async (email: string, password: string) => {
    loading.value = true;
    errorMsg.value = "";

    try {
      await authApi.signUp(email, password);
    } catch (error: unknown) {
      errorMsg.value = error instanceof Error ? error.message : "註冊失敗";
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // 登入
  const login = async (email: string, password: string) => {
    loading.value = true;
    errorMsg.value = "";

    try {
      await authApi.signIn(email, password);
    } catch (error: unknown) {
      errorMsg.value = error instanceof Error ? error.message : "登入失敗";
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // 登出
  const logout = async () => {
    loading.value = true;
    errorMsg.value = "";
    const userStore = useUserStore();
    try {
      await authApi.signOut();
      user.value = null;
      userStore.clearUser();
    } catch (error: unknown) {
      errorMsg.value = error instanceof Error ? error.message : "登出失敗";
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    errorMsg,
    register,
    login,
    logout,
  };
});
