const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

// ── Auth ─────────────────────────────────────────────────────────────────────

const DEMO_USER = {
  email: 'admin@tmbeauty.com',
  password: 'tmbeauty123',
  name: 'Thalita',
  role: 'admin',
}

app.get('/', (req, res) => res.json({ message: 'TM Beauty API is running.' }))

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' })
  if (email.toLowerCase() === DEMO_USER.email && password === DEMO_USER.password) {
    return res.json({
      success: true,
      user: { name: DEMO_USER.name, email: DEMO_USER.email, role: DEMO_USER.role },
      token: 'demo-token-tmbeauty-2024',
    })
  }
  return res.status(401).json({ error: 'Invalid credentials.' })
})

// ── In-memory stores ──────────────────────────────────────────────────────────

let appointments = [
  { id: 1, name: 'Sarah M.', email: 'sarah@email.com', service: 'Brazilian Nanoplastia', date: '2024-06-03', time: '10:00', status: 'confirmed' },
  { id: 2, name: 'Camila R.', email: 'camila@email.com', service: 'Brazilian Botox', date: '2024-06-03', time: '13:30', status: 'pending' },
]

let services = [
  { id: 1, name: 'Brazilian Nanoplastia', description: 'Advanced formaldehyde-free straightening.', price: 280, duration: '3–4 hours' },
  { id: 2, name: 'Brazilian Botox', description: 'Deep hydration and volume control.', price: 220, duration: '2–3 hours' },
  { id: 3, name: 'Deep Treatment', description: 'Intensive reconstructive treatment.', price: 180, duration: '1–2 hours' },
]

let gallery = [
  { id: 1, category: 'Nanoplastia', caption: 'Curly hair → silky straight', date: '2024-05-10' },
  { id: 2, category: 'Botox', caption: 'Volume controlled', date: '2024-05-15' },
]

let faq = [
  { id: 1, question: 'How long does a Nanoplastia treatment take?', answer: 'A Nanoplastia treatment takes about 3 to 4 hours on average.' },
  { id: 2, question: 'Can I wash my hair the same day?', answer: 'For Nanoplastia, we recommend waiting at least 72 hours before washing.' },
  { id: 3, question: 'Do the treatments contain formaldehyde?', answer: 'No. All treatments are formaldehyde-free.' },
]

let nextId = 100

const newId = () => ++nextId

// ── Appointments ──────────────────────────────────────────────────────────────

app.get('/api/appointments', (req, res) => res.json(appointments))

app.post('/api/appointments', (req, res) => {
  const appt = { ...req.body, id: newId() }
  appointments.push(appt)
  res.status(201).json(appt)
})

app.put('/api/appointments/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = appointments.findIndex(a => a.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Not found.' })
  appointments[idx] = { ...appointments[idx], ...req.body, id }
  res.json(appointments[idx])
})

app.delete('/api/appointments/:id', (req, res) => {
  const id = Number(req.params.id)
  appointments = appointments.filter(a => a.id !== id)
  res.json({ success: true })
})

// ── Services ─────────────────────────────────────────────────────────────────

app.get('/api/services', (req, res) => res.json(services))

app.put('/api/services', (req, res) => {
  services = req.body
  res.json(services)
})

app.put('/api/services/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = services.findIndex(s => s.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Not found.' })
  services[idx] = { ...services[idx], ...req.body, id }
  res.json(services[idx])
})

// ── Gallery ───────────────────────────────────────────────────────────────────

app.get('/api/gallery', (req, res) => res.json(gallery))

app.post('/api/gallery', (req, res) => {
  const item = { ...req.body, id: newId() }
  gallery.push(item)
  res.status(201).json(item)
})

app.delete('/api/gallery/:id', (req, res) => {
  const id = Number(req.params.id)
  gallery = gallery.filter(g => g.id !== id)
  res.json({ success: true })
})

// ── FAQ ───────────────────────────────────────────────────────────────────────

app.get('/api/faq', (req, res) => res.json(faq))

app.post('/api/faq', (req, res) => {
  const item = { ...req.body, id: newId() }
  faq.push(item)
  res.status(201).json(item)
})

app.put('/api/faq/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = faq.findIndex(f => f.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Not found.' })
  faq[idx] = { ...faq[idx], ...req.body, id }
  res.json(faq[idx])
})

app.delete('/api/faq/:id', (req, res) => {
  const id = Number(req.params.id)
  faq = faq.filter(f => f.id !== id)
  res.json({ success: true })
})

// ── Contact Info ──────────────────────────────────────────────────────────────

let contactInfo = {
  phone: '+61 400 000 000',
  whatsapp: '61400000000',
  email: 'hello@thalitamedeiros.com.au',
  instagram: 'thalita.medeiros.hair',
  address: 'Melbourne, Victoria, Australia',
  mapUrl: '',
  hoursMonFri: '9:00 – 18:00',
  hoursSat: '9:00 – 15:00',
  hoursSun: 'Closed',
  bookingNote: 'Book via WhatsApp or fill in the contact form.',
}

app.get('/api/contact', (req, res) => res.json(contactInfo))

app.put('/api/contact', (req, res) => {
  contactInfo = { ...contactInfo, ...req.body }
  res.json(contactInfo)
})

// ── Media / Photos ────────────────────────────────────────────────────────────

let media = {
  hero: [],
  studio: [],
  about: [],
  experience: [],
}

app.get('/api/media', (req, res) => res.json(media))

app.put('/api/media/:section', (req, res) => {
  const { section } = req.params
  if (!Object.keys(media).includes(section)) return res.status(400).json({ error: 'Unknown section.' })
  media[section] = req.body.photos || []
  res.json(media)
})

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`TM Beauty server running on http://localhost:${PORT}`)
})
