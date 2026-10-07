const { cors, supabase, newToken, adminPayload, customerPayload, isAdminLogin, bcrypt } = require('./_shared')

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  if (isAdminLogin(email, password)) {
    return res.json(adminPayload())
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('email', String(email).toLowerCase().trim())
    .maybeSingle()

  if (error) return res.status(500).json({ error: error.message })
  if (!data) return res.status(401).json({ error: 'Invalid credentials.' })

  const ok = await bcrypt.compare(password, data.password_hash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials.' })

  const session_token = newToken()
  const { data: updated, error: updErr } = await supabase
    .from('customers')
    .update({ session_token })
    .eq('id', data.id)
    .select()
    .single()

  if (updErr) return res.status(500).json({ error: updErr.message })
  return res.json(customerPayload(updated))
}
