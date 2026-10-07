const { cors } = require('./_shared')

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })

  const url = process.env.SUPABASE_URL || ''
  const anonKey = process.env.SUPABASE_ANON_KEY || ''
  if (!url || !anonKey) {
    return res.status(500).json({ error: 'Google sign-in is not configured on the server.' })
  }
  return res.json({ url, anonKey })
}
