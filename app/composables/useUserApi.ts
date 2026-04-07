// composables/useUserApi.ts
import type {
  UserProfile,
  UpdateProfilePayload,
  MeResponse,
} from "@/types/data/user";

export const useUserApi = () => {
  const api = useApi();
  const getMe = () => {
    return api<MeResponse>("/api/profile");
  };

  const updateProfile = (payload: UpdateProfilePayload) => {
    return api<{ ok: boolean; profile: UserProfile }>("/api/profile", {
      method: "PUT",
      body: {
        first_name: payload.first_name,
        last_name: payload.last_name,
        birthday: payload.birthday || null,
      },
    });
  };

  return {
    getMe,
    updateProfile,
  };
};
