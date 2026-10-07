const { cors, supabase, bearerToken, customerPayload } = require('./_shared')

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

  const token = bearerToken(req)
  if (!token || token === 'demo-token-tmbeauty-2024') {
    return res.status(401).json({ error: 'Sign in as a customer to redeem this coupon.' })
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('session_token', token)
    .maybeSingle()

  if (error) return res.status(500).json({ error: error.message })
  if (!data) return res.status(401).json({ error: 'Please sign in again to redeem.' })
  if (data.coupon_redeemed_at) {
    return res.json({ ...customerPayload(data), alreadyRedeemed: true })
  }

  const { data: updated, error: updErr } = await supabase
    .from('customers')
    .update({ coupon_redeemed_at: new Date().toISOString() })
    .eq('id', data.id)
    .select()
    .single()

  if (updErr) return res.status(500).json({ error: updErr.message })
  return res.json({ ...customerPayload(updated), code: 'WELCOME15' })
}
