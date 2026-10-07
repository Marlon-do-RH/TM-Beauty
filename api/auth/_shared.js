const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const supabase = require('../_supabase')

const DEMO_ADMIN = {
  email: 'admin@tmbeauty.com',
  password: 'tmbeauty123',
  name: 'Thalita',
  role: 'admin',
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

function newToken() {
  return crypto.randomBytes(24).toString('hex')
}

function adminPayload() {
  return {
    success: true,
    token: 'demo-token-tmbeauty-2024',
    role: 'admin',
    first_coupon_eligible: false,
    user: { name: DEMO_ADMIN.name, email: DEMO_ADMIN.email, role: 'admin' },
  }
}

function customerPayload(row) {
  return {
    success: true,
    token: row.session_token,
    role: 'customer',
    first_coupon_eligible: !row.coupon_redeemed_at,
    user: {
      id: row.id,
      name: row.name,
      email: row.email,
      role: 'customer',
      couponRedeemed: !!row.coupon_redeemed_at,
    },
  }
}

function isAdminLogin(email, password) {
  return email.toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password
}

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || ''
  const fromHeader = String(header).replace(/^Bearer\s+/i, '').trim()
  return fromHeader || req.body?.token || req.query?.token || ''
}

module.exports = {
  bcrypt,
  supabase,
  DEMO_ADMIN,
  cors,
  newToken,
  adminPayload,
  customerPayload,
  isAdminLogin,
  bearerToken,
}
