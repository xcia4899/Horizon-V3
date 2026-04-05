import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event);
  const id = String(getRouterParam(event, "id"));

  if (!id || id === "undefined") {
    throw createError({
      statusCode: 400,
      statusMessage: "無效的 id",
    });
  }

  const { data, error: deleteError } = await client
    .from("products")
    .delete()
    .eq("id", id)
    .select(); // 加這個比較好 debug

  console.log("DELETE ERROR:", deleteError);
  console.log("DELETE DATA:", data);
  if (deleteError) {
    throw createError({
      statusCode: 500,
      statusMessage: `刪除資料失敗：${deleteError.message}`,
    });
  }
  console.log("SERVICE ROLE exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log(
    "SERVICE ROLE length:",
    process.env.SUPABASE_SERVICE_ROLE_KEY?.length,
  );
  return {
    ok: true,
    message: "商品資料已刪除",
    data,
  };
});
