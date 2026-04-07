// types/user.ts
export interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  birthday: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  birthday: string | null;
}

export interface MeResponse {
  ok: boolean;
  user: {
    id: string;
    email?: string;
  };
  profile: UserProfile;
}