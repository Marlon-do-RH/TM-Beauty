import { createContext, useCallback, useContext, useState } from 'react'

const TOKEN_KEY = 'tm_token'

const AdminAuthContext = createContext(null)

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  })

  const isAdmin = !!token

  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    let data = {}
    try { data = await res.json() } catch { /* empty */ }
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Invalid credentials. Please try again.')
    }
    try { localStorage.setItem(TOKEN_KEY, data.token) } catch { /* empty */ }
    setToken(data.token)
    return data
  }, [])

  const logout = useCallback(() => {
    try { localStorage.removeItem(TOKEN_KEY) } catch { /* empty */ }
    setToken(null)
  }, [])

  return (
    <AdminAuthContext.Provider value={{ isAdmin, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}
