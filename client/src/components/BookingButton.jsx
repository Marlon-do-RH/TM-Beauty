import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './BookingButton.module.css'

export default function BookingButton({ label, variant = 'primary', to = '/agendar', onClick }) {
  const { t } = useLanguage()
  const text = label ?? t('common', 'bookNow')

  if (onClick) {
    return (
      <button type="button" className={`${styles.btn} ${styles[variant]}`} onClick={onClick}>
        {text}
      </button>
    )
  }

  return (
    <Link to={to} className={`${styles.btn} ${styles[variant]}`}>
      {text}
    </Link>
  )
}
