// Demo credentials — replace with a real database in production
const DEMO_USER = {
  email: 'admin@tmbeauty.com',
  password: 'tmbeauty123',
  name: 'Thalita',
  role: 'admin',
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  if (
    email.toLowerCase() === DEMO_USER.email &&
    password === DEMO_USER.password
  ) {
    return res.json({
      success: true,
      user: { name: DEMO_USER.name, email: DEMO_USER.email, role: DEMO_USER.role },
      token: 'demo-token-tmbeauty-2024',
    })
  }

  return res.status(401).json({ error: 'Invalid credentials.' })
}
