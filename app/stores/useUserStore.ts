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
interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  birthday: string | null;
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
      const result = await $fetch<MeResponse>("/api/profile");
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
  // 更新會員資料
  const updateProfile = async (payload: UpdateProfilePayload) => {
    pending.value = true;
    errorMsg.value = "";

    try {
      const result = await $fetch<{ ok: boolean; profile: UserProfile }>(
        "/api/profile",
        {
          method: "PUT",
          body: {
            first_name: payload.first_name,
            last_name: payload.last_name,
            birthday: payload.birthday || null,
          },
        },
      );

      profile.value = result.profile;
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
