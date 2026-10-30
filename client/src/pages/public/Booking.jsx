import { useEffect, useRef } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './Booking.module.css'

/** Square Appointments booking widget for this location. */
const SQUARE_WIDGET_SRC =
  'https://square.site/appointments/buyer/widget/e54unyi5128xkb/LWTMC13W73RJF.js'

/** Direct booking flow (fallback / open-in-new-tab). */
export const SQUARE_BOOKING_URL =
  'https://app.squareup.com/appointments/book/e54unyi5128xkb/LWTMC13W73RJF/start'

export default function Booking() {
  const { t } = useLanguage()
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    mount.innerHTML = ''
    const script = document.createElement('script')
    script.src = SQUARE_WIDGET_SRC
    script.async = true
    mount.appendChild(script)

    return () => {
      mount.innerHTML = ''
    }
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>{t('common', 'bookNow')}</p>
          <h1 className={styles.title}>{t('booking', 'title')}</h1>
        </div>
        <div
          ref={mountRef}
          className={styles.scheduler}
          title={t('booking', 'title')}
        />
        <p className={styles.fallback}>
          Having trouble loading the calendar?{' '}
          <a href={SQUARE_BOOKING_URL} target="_blank" rel="noopener noreferrer">
            Open booking in a new tab
          </a>
        </p>
      </div>
    </div>
  )
}
