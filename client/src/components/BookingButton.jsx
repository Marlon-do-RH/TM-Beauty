import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './BookingButton.module.css'

export default function BookingButton({ label, variant = 'primary', to = '/contato' }) {
  const { t } = useLanguage()
  const text = label ?? t('common', 'bookNow')
  return (
    <Link to={to} className={`${styles.btn} ${styles[variant]}`}>
      {text}
    </Link>
  )
}
