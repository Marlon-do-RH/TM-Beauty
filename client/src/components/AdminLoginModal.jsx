import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSession } from '../context/AdminAuth'
import styles from './AdminLoginModal.module.css'

export default function AdminLoginModal({ onClose }) {
  const { login, logout } = useSession()
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
      const data = await login(email, password)
      if (data.role !== 'admin') {
        logout()
        throw new Error('This login is for staff only. Book and redeem WELCOME10 in Acuity.')
      }
      onClose()
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
        <h2 id="auth-title" className={styles.title}>Staff log in</h2>
        <p className={styles.sub}>
          Admin only. Customers book and redeem WELCOME10 in Acuity checkout.
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.label} htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            className={styles.input}
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
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
            {loading ? 'Signing in…' : 'Log in'}
          </button>
        </form>

        <button type="button" className={styles.closePill} onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body,
  )
}
