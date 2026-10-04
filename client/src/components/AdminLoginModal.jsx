import { useEffect, useState } from 'react'
import { useAdminAuth } from '../context/AdminAuth'
import styles from './AdminLoginModal.module.css'

export default function AdminLoginModal({ origin, onClose }) {
  const { login } = useAdminAuth()
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
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      onClose()
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const ox = origin?.x ?? 90
  const oy = origin?.y ?? 6

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.card}
        style={{ '--ox': `${ox}%`, '--oy': `${oy}%` }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className={styles.eyebrow}>Admin</p>
        <h2 id="admin-login-title" className={styles.title}>Welcome back</h2>
        <p className={styles.sub}>Sign in to edit photos and gallery on this page.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.label} htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            className={styles.input}
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />

          <label className={styles.label} htmlFor="admin-password">Password</label>
          <div className={styles.passwordRow}>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
