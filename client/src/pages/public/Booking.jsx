import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './Booking.module.css'

const ACUITY_OWNER = '40382920'
const ACUITY_BASE = `https://app.acuityscheduling.com/schedule.php?owner=${ACUITY_OWNER}`
const ACUITY_EMBED_JS = 'https://embed.acuityscheduling.com/js/embed.js'

/** Map site service keys to Acuity appointmentType IDs when those types exist. */
const SERVICE_TYPE_IDS = {
  // consultation: '98230321',
  // nano: '',
  // botox: '',
  // deep: '',
}

function acuitySrc(serviceKey) {
  const typeId = SERVICE_TYPE_IDS[serviceKey]
  if (typeId) return `${ACUITY_BASE}&appointmentType=${typeId}`
  return ACUITY_BASE
}

export default function Booking() {
  const { t } = useLanguage()
  const [params] = useSearchParams()
  const src = acuitySrc(params.get('service') || '')

  useEffect(() => {
    const script = document.createElement('script')
    script.src = ACUITY_EMBED_JS
    script.async = true
    document.body.appendChild(script)
    return () => {
      script.remove()
    }
  }, [src])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>{t('common', 'bookNow')}</p>
          <h1 className={styles.title}>{t('booking', 'title')}</h1>
        </div>
        <iframe
          src={src}
          title={t('booking', 'title')}
          className={styles.scheduler}
          width="100%"
          height="800"
          frameBorder="0"
          allow="payment"
        />
      </div>
    </div>
  )
}
