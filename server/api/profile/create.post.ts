import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event);

  const body = await readBody(event);

  const { data, error } = await client.from("profiles").insert({
    id: body.id,
    email: body.email,
    first_name: body.firstName,
    last_name: body.lastName,
    role: "user", // 預設
  });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return { ok: true, data };
});