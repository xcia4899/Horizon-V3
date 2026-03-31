import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "@/types/database.types";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const id = getRouterParam(event, "id");
  // const  {id}  = getRouterParams(event); //多個參數用法

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "缺少 id",
    });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `讀取資料失敗 ${error.message}`,
    });
  }
  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: "找不到商品",
    });
  }
  return {
    data,
  };
});
