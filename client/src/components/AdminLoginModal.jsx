import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/AdminAuth'
import { getSupabase } from '../lib/supabaseClient'
import styles from './AdminLoginModal.module.css'

export default function AdminLoginModal({ onClose, initialMode = 'login' }) {
  const { login, register } = useSession()
  const navigate = useNavigate()
  const [mode, setMode] = useState(initialMode === 'register' ? 'register' : 'login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password || (mode === 'register' && !name.trim())) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const data = mode === 'register'
        ? await register({ name, email, password })
        : await login(email, password)
      onClose()
      if (data.role === 'customer') navigate('/profile')
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      const supabase = await getSupabase()
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (oauthErr) throw oauthErr
    } catch (err) {
      setError(err.message || 'Google sign-in could not start.')
      setLoading(false)
    }
  }

  const isRegister = mode === 'register'

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.card}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <div className={styles.mark} aria-hidden="true">TM</div>
        <h2 id="auth-title" className={styles.title}>{isRegister ? 'Create account' : 'Log in'}</h2>
        <p className={styles.sub}>
          {isRegister
            ? 'Register to unlock 15% off your first booking and keep your details in one place.'
            : 'Customers see their profile. Admin stays on this page to edit the site.'}
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <>
              <label className={styles.label} htmlFor="auth-name">Name</label>
              <input
                id="auth-name"
                className={styles.input}
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                autoFocus
              />
            </>
          )}

          <label className={styles.label} htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            className={styles.input}
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus={!isRegister}
          />

          <label className={styles.label} htmlFor="auth-password">Password</label>
          <div className={styles.passwordRow}>
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? (isRegister ? 'Creating…' : 'Signing in…') : (isRegister ? 'Register' : 'Log in')}
          </button>
        </form>

        <div className={styles.divider} aria-hidden="true">
          <span />
          <em>or</em>
          <span />
        </div>

        <button type="button" className={styles.google} onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.8-6.6 7.4l6.3 5.2C37.3 38.3 44 33 44 24c0-1.2-.1-2.3-.4-3.5z"/>
          </svg>
          Continue with Google
        </button>

        <p className={styles.switch}>
          {isRegister ? (
            <>Already have an account? <button type="button" onClick={() => { setMode('login'); setError('') }}>Log in</button></>
          ) : (
            <>Don’t have an account? <button type="button" onClick={() => { setMode('register'); setError('') }}>Register</button></>
          )}
        </p>

        <button type="button" className={styles.closePill} onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body,
  )
}
