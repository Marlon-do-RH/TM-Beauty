const supabase = require('../_supabase')

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const CATEGORIES = ['Nanoplastia', 'Botox', 'Deep Treatment']

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    const { section, view } = req.query

    // Carousel view: return 1 featured-or-latest item per category
    if (view === 'carousel') {
      const results = []
      for (const category of CATEGORIES) {
        // Try featured first
        const { data: featured } = await supabase
          .from('gallery')
          .select('*')
          .eq('category', category)
          .eq('featured', true)
          .limit(1)
          .single()

        if (featured) {
          results.push(featured)
          continue
        }

        // Fall back to latest
        const { data: latest } = await supabase
          .from('gallery')
          .select('*')
          .eq('category', category)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (latest) results.push(latest)
      }
      return res.json(results)
    }

    // Regular listing
    let query = supabase.from('gallery').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false })
    if (section) query = query.eq('section', section)
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }

  if (req.method === 'POST') {
    const { data, error } = await supabase
      .from('gallery')
      .insert(req.body)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  res.status(405).json({ error: 'Method not allowed' })
}
