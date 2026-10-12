import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '../context/AdminAuth'
import { FIRST_VISIT_CODE, FIRST_VISIT_PERCENT } from '../lib/coupon'
import styles from './WelcomeOffer.module.css'

const SEEN_KEY = 'tm_welcome_offer_seen'

function splashFinished() {
  try { return !!sessionStorage.getItem('tm_splash') } catch { return true }
}

function alreadySeen() {
  try { return !!localStorage.getItem(SEEN_KEY) } catch { return false }
}

function markSeen() {
  try { localStorage.setItem(SEEN_KEY, '1') } catch { /* empty */ }
}

export default function WelcomeOffer() {
  const { isAdmin } = useSession()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      setOpen(false)
      return
    }
    if (pathname === '/agendar') return
    if (alreadySeen()) return

    let cancelled = false
    const show = () => {
      if (cancelled || !splashFinished()) return false
      setOpen(true)
      return true
    }
    if (show()) return undefined
    const id = setInterval(() => { if (show()) clearInterval(id) }, 200)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [isAdmin, pathname])

  const dismiss = useCallback(() => {
    markSeen()
    setOpen(false)
  }, [])

  const bookNow = () => {
    dismiss()
    navigate('/agendar')
  }

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') dismiss() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, dismiss])

  if (!open) return null

  return createPortal(
    <div className={styles.overlay} onClick={dismiss} role="presentation">
      <div
        className={styles.card}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-offer-title"
      >
        <button type="button" className={styles.close} onClick={dismiss} aria-label="Close offer">
          ×
        </button>
        <div className={styles.banner}>
          <p className={styles.eyebrow}>First booking gift</p>
          <p className={styles.bannerTitle}>Special offer</p>
        </div>
        <div className={styles.body}>
          <p id="welcome-offer-title" className={styles.percent}>
            {FIRST_VISIT_PERCENT}% off
          </p>
          <p className={styles.sub}>your first booking</p>
          <p className={styles.copy}>
            Use this code at Acuity checkout after you log in there. It applies once, on your first booking.
          </p>
          <p className={styles.code}>{FIRST_VISIT_CODE}</p>
          <button type="button" className={styles.cta} onClick={bookNow}>
            Book now
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
