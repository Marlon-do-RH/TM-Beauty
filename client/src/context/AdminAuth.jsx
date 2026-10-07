import { createContext, useCallback, useContext, useState } from 'react'

const TOKEN_KEY = 'tm_token'
const ROLE_KEY = 'tm_role'
const USER_KEY = 'tm_user'

const SessionContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within AdminAuthProvider')
  return ctx
}

export function useAdminAuth() {
  return useSession()
}

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  })
  const [role, setRole] = useState(() => {
    try { return localStorage.getItem(ROLE_KEY) || (localStorage.getItem(TOKEN_KEY) ? 'admin' : 'guest') } catch { return 'guest' }
  })
  const [user, setUser] = useState(readStoredUser)
  const [couponEligible, setCouponEligible] = useState(false)
  const [loginRequested, setLoginRequested] = useState(false)

  const persist = (nextToken, nextRole, nextUser) => {
    try {
      if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken)
      else localStorage.removeItem(TOKEN_KEY)
      if (nextRole && nextRole !== 'guest') localStorage.setItem(ROLE_KEY, nextRole)
      else localStorage.removeItem(ROLE_KEY)
      if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      else localStorage.removeItem(USER_KEY)
    } catch { /* empty */ }
    setToken(nextToken)
    setRole(nextRole || 'guest')
    setUser(nextUser)
  }

  const applyAuth = (data) => {
    const nextRole = data.role || data.user?.role || 'guest'
    persist(data.token, nextRole, data.user || null)
    const eligible = nextRole === 'customer' && !!data.first_coupon_eligible
    setCouponEligible(eligible)
    return { ...data, role: nextRole, first_coupon_eligible: eligible }
  }

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
    return applyAuth(data)
  }, [])

  const loginWithGoogle = useCallback(async (accessToken) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: accessToken }),
    })
    let data = {}
    try { data = await res.json() } catch { /* empty */ }
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Google sign-in failed.')
    }
    return applyAuth(data)
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    let data = {}
    try { data = await res.json() } catch { /* empty */ }
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Could not create your account.')
    }
    return applyAuth(data)
  }, [])

  const redeemCoupon = useCallback(async () => {
    const current = (() => { try { return localStorage.getItem(TOKEN_KEY) } catch { return token } })()
    const res = await fetch('/api/auth/redeem-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: current ? `Bearer ${current}` : '',
      },
      body: JSON.stringify({ token: current }),
    })
    let data = {}
    try { data = await res.json() } catch { /* empty */ }
    if (!res.ok) {
      throw new Error(data.error || 'Could not redeem coupon.')
    }
    if (data.user) persist(data.token || current, 'customer', data.user)
    setCouponEligible(false)
    return data
  }, [token])

  const logout = useCallback(() => {
    persist(null, 'guest', null)
    setCouponEligible(false)
    setLoginRequested(false)
  }, [])

  const requestLogin = useCallback(() => setLoginRequested(true), [])
  const clearLoginRequest = useCallback(() => setLoginRequested(false), [])
  const dismissCoupon = useCallback(() => setCouponEligible(false), [])

  const isAdmin = role === 'admin'
  const isCustomer = role === 'customer'

  return (
    <SessionContext.Provider value={{
      isAdmin,
      isCustomer,
      role,
      token,
      user,
      login,
      loginWithGoogle,
      register,
      logout,
      redeemCoupon,
      couponEligible,
      dismissCoupon,
      requestLogin,
      loginRequested,
      clearLoginRequest,
    }}>
      {children}
    </SessionContext.Provider>
  )
}
