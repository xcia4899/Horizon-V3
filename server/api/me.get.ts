import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  if (userError || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: "未登入",
    });
  }

  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw createError({
      statusCode: 500,
      statusMessage: profileError.message,
    });
  }

  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email,
    },
    profile,
  };
});