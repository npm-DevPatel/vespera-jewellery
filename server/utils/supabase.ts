import { createClient } from '@supabase/supabase-js'

export const useServerSupabase = () => {
  const config = useRuntimeConfig()
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing Supabase environment variables'
    })
  }
  return createClient(config.supabaseUrl, config.supabaseAnonKey)
}