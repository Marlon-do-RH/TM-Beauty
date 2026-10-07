const { cors, supabase, newToken, customerPayload, isAdminLogin, bcrypt } = require('./_shared')

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

  const { name, email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' })
  }
  if (isAdminLogin(email, password)) {
    return res.status(400).json({ error: 'This email is reserved. Please sign in instead.' })
  }

  const normalized = String(email).toLowerCase().trim()
  const { data: existing, error: findErr } = await supabase
    .from('customers')
    .select('id')
    .eq('email', normalized)
    .maybeSingle()

  if (findErr) return res.status(500).json({ error: findErr.message })
  if (existing) return res.status(409).json({ error: 'An account with this email already exists.' })

  const password_hash = await bcrypt.hash(password, 10)
  const session_token = newToken()
  const { data, error } = await supabase
    .from('customers')
    .insert({
      email: normalized,
      password_hash,
      name: (name || '').trim() || null,
      session_token,
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  return res.status(201).json(customerPayload(data))
}
