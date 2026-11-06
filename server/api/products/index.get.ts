export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase()
  const query = getQuery(event)

  let dbQuery = supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true })

  if (query.category && query.category !== 'All') {
    dbQuery = dbQuery.eq('category', String(query.category))
  }

  const { data, error } = await dbQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})