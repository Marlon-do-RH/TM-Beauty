import { createClient } from '@supabase/supabase-js'

let client = null

export async function getSupabase() {
  if (client) return client
  const res = await fetch('/api/auth/supabase-public')
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.url || !data.anonKey) {
    const detail = data.error || (res.status === 404
      ? 'Google login API is not on this deployment yet.'
      : `Could not load Google sign-in (HTTP ${res.status}).`)
    throw new Error(detail)
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
