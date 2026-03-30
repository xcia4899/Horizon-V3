// server/api/products/index.post.ts
import { serverSupabaseServiceRole } from "#supabase/server";
import { readBody, createError } from "h3";
import type { Database } from "@/types/database.types";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole<Database>(event);
  const body = await readBody<ProductInsert>(event);

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: "缺少商品資料",
    });
  }

  if (!body.id || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: "id 與 name 為必填",
    });
  }

  const { data, error } = await client
    .from("products")
    .insert(body)
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
    data,
  };
});