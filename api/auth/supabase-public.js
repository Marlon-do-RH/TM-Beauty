module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })

  const url = process.env.SUPABASE_URL || ''
  const anonKey = process.env.SUPABASE_ANON_KEY || ''
  if (!url || !anonKey) {
    return res.status(500).json({
      error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY on the server. Add them in Vercel project environment variables.',
    })
  }
  return res.json({ url, anonKey })
}
