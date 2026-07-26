const supabase = require('../_supabase')

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }

  if (req.method === 'POST') {
    const { name, contact, service, notes, photo_url } = req.body
    const { data, error } = await supabase
      .from('consultations')
      .insert({ name, contact, service, notes, photo_url, status: 'new' })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  res.status(405).json({ error: 'Method not allowed' })
}
