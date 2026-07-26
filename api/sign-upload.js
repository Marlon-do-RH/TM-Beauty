const crypto = require('crypto')

// Public values — safe to hardcode (API key alone is useless without the secret)
const CLOUD_NAME = 'rhknykmy'
const API_KEY = '765385211885853'

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!apiSecret) return res.status(500).json({ error: 'CLOUDINARY_API_SECRET not configured' })

  const folder = req.query.folder || 'tm-beauty/gallery'
  const timestamp = Math.round(Date.now() / 1000)

  const params = { folder, timestamp }
  const toSign = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&') + apiSecret
  const signature = crypto.createHash('sha1').update(toSign).digest('hex')

  res.json({ signature, timestamp, api_key: API_KEY, cloud_name: CLOUD_NAME })
}
