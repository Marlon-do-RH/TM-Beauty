const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Demo credentials — replace with a real database in production
const DEMO_USER = {
  email: 'admin@tmbeauty.com',
  password: 'tmbeauty123',
  name: 'Salon Admin',
  role: 'admin',
}

app.get('/', (req, res) => {
  res.json({ message: 'TM Beauty API is running.' })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body

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
})

app.listen(PORT, () => {
  console.log(`TM Beauty server running on http://localhost:${PORT}`)
})
