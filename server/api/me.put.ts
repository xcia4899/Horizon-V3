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

  const body = await readBody<{
    first_name?: string;
    last_name?: string;
    birthday?: string | null;
  }>(event);

  const { data, error } = await client
    .from("profiles")
    .update({
      first_name: body.first_name ?? null,
      last_name: body.last_name ?? null,
      birthday: body.birthday ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return {
    ok: true,
    message: "會員資料更新成功",
    data,
  };
});