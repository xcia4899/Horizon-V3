// server/api/products/[id].put.ts
import { serverSupabaseServiceRole } from "#supabase/server";
import { readBody, createError } from "h3";
import type { Database } from "@/types/database.types";

type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseServiceRole<Database>(event);
  const id = getRouterParam(event, "id");
  const body = await readBody<ProductUpdate>(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "缺少 id",
    });
  }

  if (!body || Object.keys(body).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "缺少更新資料",
    });
  }

  const { data, error } = await supabase
    .from("products")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: "找不到要更新的商品",
    });
  }
  return {
    ok: true,
    data,
  };
});
