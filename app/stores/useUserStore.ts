// stores/useUserStore.ts
import { defineStore } from "pinia";
import type { UserProfile, UpdateProfilePayload } from "@/types/data/user";


export const useUserStore = defineStore("user", () => {
  const profile = ref<UserProfile | null>(null);
  const pending = ref(false);
  const errorMsg = ref("");
  const isLoaded = ref(false);

  const userApi = useUserApi();

  const fetchMe = async (force = false) => {
    if (pending.value) return;
    if (isLoaded.value && !force) return;

    pending.value = true;
    errorMsg.value = "";

    try {
      const result = await userApi.getMe();
      profile.value = result.profile;
      isLoaded.value = true;
      return result.profile;
    } catch (error: unknown) {
      errorMsg.value =
        error instanceof Error ? error.message : "讀取會員資料失敗";
      profile.value = null;
      isLoaded.value = false;
      throw error;
    } finally {
      pending.value = false;
    }
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    pending.value = true;
    errorMsg.value = "";

    try {
      const result = await userApi.updateProfile(payload);
      profile.value = result.profile;
      isLoaded.value = true;
      return result.profile;
    } catch (error: unknown) {
      errorMsg.value =
        error instanceof Error ? error.message : "會員資料更新失敗";
      throw error;
    } finally {
      pending.value = false;
    }
  };

  const clearUser = () => {
    profile.value = null;
    isLoaded.value = false;
    errorMsg.value = "";
  };

  const fullName = computed(() => {
    if (!profile.value) return "";
    return `${profile.value.last_name ?? ""}${profile.value.first_name ?? ""}`;
  });

  const role = computed(() => profile.value?.role ?? "user");
  const isAdmin = computed(() => role.value === "admin");

  return {
    profile,
    pending,
    errorMsg,
    isLoaded,
    fullName,
    role,
    isAdmin,
    fetchMe,
    updateProfile,
    clearUser,
  };
});