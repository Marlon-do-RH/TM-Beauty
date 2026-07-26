const supabase = require('../_supabase')

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

// Returns which time slots are already booked for a given date
// Slots: morning | afternoon | evening
module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    const { date } = req.query
    if (!date) return res.status(400).json({ error: 'date is required' })

    const { data, error } = await supabase
      .from('appointments')
      .select('time')
      .eq('date', date)
      .not('status', 'eq', 'cancelled')

    if (error) return res.status(500).json({ error: error.message })

    const booked = data.map(r => r.time)
    return res.json({ date, booked })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
