// composables/useApi.ts
export function useApi() {
  const config = useRuntimeConfig();
  const baseURL = (config.public.apiBase || "") as string;

  return  $fetch.create({ baseURL });
}