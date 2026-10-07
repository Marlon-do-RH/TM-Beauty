import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/AdminAuth'
import styles from './CouponModal.module.css'

const CODE = 'WELCOME10'

export default function CouponModal({ onClose }) {
  const { redeemCoupon } = useSession()
  const navigate = useNavigate()

  const redeem = async () => {
    try {
      await redeemCoupon()
      try { await navigator.clipboard.writeText(CODE) } catch { /* empty */ }
      onClose()
      navigate('/agendar')
    } catch (err) {
      alert(err.message || 'Could not redeem coupon.')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.card} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="coupon-title">
        <p className={styles.eyebrow}>Welcome gift</p>
        <h2 id="coupon-title" className={styles.title}>10% off your first visit</h2>
        <p className={styles.copy}>
          Redeem this one-time code after you register and sign in. Enter it at checkout on Acuity when you book.
        </p>
        <p className={styles.code}>{CODE}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.redeem} onClick={redeem}>Redeem</button>
          <button type="button" className={styles.later} onClick={onClose}>Later</button>
        </div>
      </div>
    </div>
  )
}
