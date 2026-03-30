import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "@/types/database.types";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);

  const { data, error: getError } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });
  
  if (getError) {
    throw createError({
      statusCode: 500,
      statusMessage: `讀取資料失敗${getError.message}`,
    });
  }

  return {
    data: data ?? [],
  };
});
