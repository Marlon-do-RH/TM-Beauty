import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/AdminAuth'
import styles from './AdminLoginModal.module.css'

export default function AdminLoginModal({ origin, onClose }) {
  const { login, register } = useSession()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
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

  const ox = origin?.x ?? 90
  const oy = origin?.y ?? 6
  const isRegister = mode === 'register'

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.card}
        style={{ '--ox': `${ox}%`, '--oy': `${oy}%` }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <div className={styles.mark} aria-hidden="true">TM</div>
        <h2 id="auth-title" className={styles.title}>{isRegister ? 'Create account' : 'Log in'}</h2>
        <p className={styles.sub}>
          {isRegister
            ? 'Register to unlock your first-visit coupon and keep your details in one place.'
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
    </div>
  )
}
