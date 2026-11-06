export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const supabase = useServerSupabase()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found'
    })
  }

  return data
})