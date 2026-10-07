import { createClient } from '@supabase/supabase-js'

let client = null

export async function getSupabase() {
  if (client) return client
  const res = await fetch('/api/auth/config')
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.url || !data.anonKey) {
    throw new Error(data.error || 'Google sign-in is not configured.')
  }
  client = createClient(data.url, data.anonKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  })
  return client
}
