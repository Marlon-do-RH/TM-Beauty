import { useLanguage } from '../../i18n/LanguageContext'
import styles from './Booking.module.css'

/** Square Appointments booking flow for this location. */
const SQUARE_BOOKING_URL =
  'https://app.squareup.com/appointments/book/e54unyi5128xkb/LWTMC13W73RJF/start'

export { SQUARE_BOOKING_URL }

export default function Booking() {
  const { t } = useLanguage()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{t('common', 'bookNow')}</p>
            <h1 className={styles.title}>{t('booking', 'title')}</h1>
          </div>
          <a
            className={styles.openLink}
            href={SQUARE_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in new tab
          </a>
        </div>
        <iframe
          src={SQUARE_BOOKING_URL}
          title={t('booking', 'title')}
          className={styles.scheduler}
          allow="payment"
        />
      </div>
    </div>
  )
}
