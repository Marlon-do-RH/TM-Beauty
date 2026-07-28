const supabase = require('./_supabase')
const { notifyAdminNewConsultation } = require('./_notify')

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query

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

    // Fire-and-forget email; never fail the request if mail fails
    notifyAdminNewConsultation(data).catch((err) => {
      console.error('[consultations] notify email failed:', err?.message || err)
    })

    return res.status(201).json(data)
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ error: 'id is required' })
    const { status } = req.body
    const patch = {}
    if (status) patch.status = status
    const { data, error } = await supabase
      .from('consultations')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'id is required' })
    const { error } = await supabase.from('consultations').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
