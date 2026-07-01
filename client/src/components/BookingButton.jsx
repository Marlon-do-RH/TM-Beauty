import { Link } from 'react-router-dom'
import styles from './BookingButton.module.css'

export default function BookingButton({ label = 'Agendar Agora', variant = 'primary', to = '/contato' }) {
  return (
    <Link to={to} className={`${styles.btn} ${styles[variant]}`}>
      {label}
    </Link>
  )
}
