// composables/useAuthApi.ts
interface SignUpPayload {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  birthday: string;
}

export const useAuthApi = () => {
  const supabase = useSupabaseClient();

  // 註冊（含會員資料）
  const signUp = async (payload: SignUpPayload) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          last_name: payload.lastName,
          name: payload.firstName,
          birthday: payload.birthday || null,
        },
      },
    });

    if (error) throw new Error(error.message || "註冊失敗");
    return data;
  };

  //  登入
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message || "登入失敗");
    return data;
  };

  //  登出
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message || "登出失敗");
  };

  return {
    signUp,
    signIn,
    signOut,
  };
};