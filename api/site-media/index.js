const supabase = require('../_supabase')

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    const { section } = req.query
    let query = supabase.from('site_media').select('*').order('created_at', { ascending: true })
    if (section) query = query.eq('section_id', section)
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }

  if (req.method === 'POST') {
    const { section_id, url, caption } = req.body
    if (!section_id || !url) return res.status(400).json({ error: 'section_id and url are required' })
    const { data, error } = await supabase
      .from('site_media')
      .insert({ section_id, url, caption })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id is required' })
    const { error } = await supabase.from('site_media').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.status(405).json({ error: 'Method not allowed' })
}
