const supabase = require('./_supabase')

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const VALID_PERIODS = ['morning', 'afternoon', 'evening']

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id, view, date } = req.query

  if (req.method === 'GET') {
    if (view === 'availability') {
      if (!date) return res.status(400).json({ error: 'date is required' })
      const { data, error } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', date)
        .not('status', 'eq', 'cancelled')
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ date, booked: (data || []).map(r => r.time) })
    }

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }

  if (req.method === 'POST') {
    const { name, email, phone, service, date: bookingDate, time, notes, flexible, status } = req.body

    if (!name || !service || !bookingDate || !time) {
      return res.status(400).json({ error: 'name, service, date and time are required' })
    }
    if (!VALID_PERIODS.includes(time)) {
      return res.status(400).json({ error: 'time must be morning, afternoon or evening' })
    }

    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', bookingDate)
      .eq('time', time)
      .not('status', 'eq', 'cancelled')
      .limit(1)

    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'This time slot is already booked. Please choose another.' })
    }

    const payload = {
      name,
      email: email || null,
      phone: phone || null,
      service,
      date: bookingDate,
      time,
      notes: notes || null,
      flexible: !!flexible,
      status: status || 'pending',
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert(payload)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ error: 'id is required' })
    const { data, error } = await supabase
      .from('appointments')
      .update(req.body)
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'id is required' })
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
