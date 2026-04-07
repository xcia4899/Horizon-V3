import { defineStore } from "pinia";

interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  birthday: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface MeResponse {
  ok: boolean;
  user: {
    id: string;
    email?: string;
  };
  profile: UserProfile;
}

export const useUserStore = defineStore("user", () => {
  const profile = ref<UserProfile | null>(null);
  const pending = ref(false);
  const errorMsg = ref("");
  const isLoaded = ref(false);

  const fetchMe = async (force = false) => {
    if (pending.value) return;
    if (isLoaded.value && !force) return;

    pending.value = true;
    errorMsg.value = "";

    try {
      const result = await $fetch<MeResponse>("/api/me");
      profile.value = result.profile;
      isLoaded.value = true;
    } catch (error: unknown) {
      errorMsg.value =
        error instanceof Error ? error.message : "讀取會員資料失敗";
      profile.value = null;
      isLoaded.value = false;
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
    clearUser,
  };
});
