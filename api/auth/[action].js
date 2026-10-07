const { cors, supabase, newToken, customerPayload, adminPayload, DEMO_ADMIN, bcrypt } = require('./_shared')

function publicKeys(res) {
  const url = process.env.SUPABASE_URL || ''
  const anonKey = process.env.SUPABASE_ANON_KEY || ''
  if (!url || !anonKey) {
    return res.status(500).json({
      error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY on the server. Add them in Vercel project environment variables.',
    })
  }
  return res.json({ url, anonKey })
}

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const action = String(req.query.action || '')

  if (req.method === 'GET' && (action === 'supabase-public' || action === 'google')) {
    return publicKeys(res)
  }

  if (action !== 'google' || req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const access_token = req.body?.access_token
  if (!access_token) return res.status(400).json({ error: 'Missing Google session.' })

  const { data: authData, error: authErr } = await supabase.auth.getUser(access_token)
  if (authErr || !authData?.user?.email) {
    return res.status(401).json({ error: 'Google sign-in could not be verified. Please try again.' })
  }

  const email = String(authData.user.email).toLowerCase().trim()
  const name = authData.user.user_metadata?.full_name
    || authData.user.user_metadata?.name
    || null
  const google_id = authData.user.id

  if (email === DEMO_ADMIN.email) {
    return res.json(adminPayload())
  }

  const { data: existing, error: findErr } = await supabase
    .from('customers')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (findErr) return res.status(500).json({ error: findErr.message })

  const session_token = newToken()

  if (existing) {
    const update = {
      session_token,
      name: existing.name || name,
      google_id,
    }
    let { data: updated, error: updErr } = await supabase
      .from('customers')
      .update(update)
      .eq('id', existing.id)
      .select()
      .single()
    if (updErr && /google_id/i.test(updErr.message)) {
      delete update.google_id
      const retry = await supabase
        .from('customers')
        .update(update)
        .eq('id', existing.id)
        .select()
        .single()
      updated = retry.data
      updErr = retry.error
    }
    if (updErr) return res.status(500).json({ error: updErr.message })
    return res.json(customerPayload(updated))
  }

  const password_hash = await bcrypt.hash(newToken(), 10)
  const insert = {
    email,
    name,
    session_token,
    google_id,
    password_hash,
  }

  let { data, error } = await supabase.from('customers').insert(insert).select().single()
  if (error && /google_id/i.test(error.message)) {
    delete insert.google_id
    const retry = await supabase.from('customers').insert(insert).select().single()
    data = retry.data
    error = retry.error
  }
  if (error) return res.status(500).json({ error: error.message })
  return res.status(201).json(customerPayload(data))
}
