import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/AdminAuth'
import { FIRST_VISIT_CODE, FIRST_VISIT_PERCENT } from '../lib/coupon'
import styles from './CouponModal.module.css'

export default function CouponModal({ onClose }) {
  const { redeemCoupon } = useSession()
  const navigate = useNavigate()

  const redeem = async () => {
    try {
      await redeemCoupon()
      try { await navigator.clipboard.writeText(FIRST_VISIT_CODE) } catch { /* empty */ }
      onClose()
      navigate('/agendar')
    } catch (err) {
      alert(err.message || 'Could not redeem coupon.')
    }
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.card} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="coupon-title">
        <p className={styles.eyebrow}>Welcome gift</p>
        <h2 id="coupon-title" className={styles.title}>{FIRST_VISIT_PERCENT}% off your first booking</h2>
        <p className={styles.copy}>
          Redeem now to apply this one-time code to your first booking. Enter it at checkout on Acuity when you book.
        </p>
        <p className={styles.code}>{FIRST_VISIT_CODE}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.redeem} onClick={redeem}>Redeem</button>
          <button type="button" className={styles.later} onClick={onClose}>Later</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
