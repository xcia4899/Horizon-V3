import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const {data: { user },} = await client.auth.getUser();

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "未登入" });
  }

  const { data: profile } = await client
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    user,
    profile,
  };
});