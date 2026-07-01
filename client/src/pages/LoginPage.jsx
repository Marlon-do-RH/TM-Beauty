import { useState } from 'react'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setError('Invalid credentials. Please try again.')
  }

  return (
    <div className={styles.root}>
      <div className={styles.backgroundOverlay} />

      <div className={styles.container}>
        {/* Left decorative panel */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <div className={styles.brandDecor}>
              <span className={styles.decorLine} />
              <span className={styles.decorDiamond} />
              <span className={styles.decorLine} />
            </div>
            <h1 className={styles.brandName}>TM Beauty</h1>
            <p className={styles.brandTagline}>Where elegance meets expertise</p>
            <div className={styles.brandDecor}>
              <span className={styles.decorLine} />
              <span className={styles.decorDiamond} />
              <span className={styles.decorLine} />
            </div>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <span className={styles.featureDot} />
                <span>Appointment Management</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureDot} />
                <span>Client Profiles</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureDot} />
                <span>Service Catalog</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureDot} />
                <span>Revenue Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right login panel */}
        <div className={styles.rightPanel}>
          <div className={styles.card}>
            <div className={styles.logoMark}>
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoSvg}>
                <circle cx="30" cy="30" r="28" stroke="url(#goldGrad)" strokeWidth="1.5" />
                <path d="M20 38 Q30 18 40 38" stroke="url(#goldGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                <circle cx="30" cy="22" r="3" fill="url(#goldGrad)" />
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F5D98B" />
                    <stop offset="1" stopColor="#9E7A2E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h2 className={styles.cardTitle}>Welcome Back</h2>
            <p className={styles.cardSubtitle}>Sign in to your salon dashboard</p>

            {error && (
              <div className={styles.errorBanner}>
                <span className={styles.errorIcon}>!</span>
                {error}
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">Email Address</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={styles.input}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.forgotRow}>
                <a href="#" className={styles.forgotLink}>Forgot password?</a>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>TM Beauty Salon</span>
              <span className={styles.dividerLine} />
            </div>

            <p className={styles.footerNote}>
              &copy; {new Date().getFullYear()} TM Beauty. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
