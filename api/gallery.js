const supabase = require('./_supabase')

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const CATEGORIES = ['Nanoplastia', 'Botox', 'Deep Treatment']

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id, section, view } = req.query

  if (req.method === 'GET') {
    if (view === 'carousel') {
      const results = []
      for (const category of CATEGORIES) {
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

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ error: 'id is required' })

    if (req.body.featured === true) {
      const { data: existing } = await supabase
        .from('gallery')
        .select('category')
        .eq('id', id)
        .single()

      if (existing?.category) {
        await supabase
          .from('gallery')
          .update({ featured: false })
          .eq('category', existing.category)
          .neq('id', id)
      }
    }

    const { data, error } = await supabase
      .from('gallery')
      .update(req.body)
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'id is required' })
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
