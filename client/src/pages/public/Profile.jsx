import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../../context/AdminAuth'
import { FIRST_VISIT_CODE, FIRST_VISIT_PERCENT } from '../../lib/coupon'
import styles from './PageCommon.module.css'
import s from './Profile.module.css'

export default function Profile() {
  const { isCustomer, isAdmin, user, logout, requestLogin, redeemCoupon } = useSession()

  useEffect(() => {
    if (!isCustomer && !isAdmin) requestLogin()
  }, [isCustomer, isAdmin, requestLogin])

  if (!isCustomer) {
    return (
      <div>
        <section className={styles.pageHero}>
          <div className={styles.pageHeroContent}>
            <p className={styles.eyebrow}>Account</p>
            <h1 className={styles.pageTitle}>Your profile</h1>
            <p className={styles.pageSubtitle}>
              {isAdmin
                ? 'You are signed in as admin. Customer profiles and coupons are for client accounts.'
                : 'Sign in or register to see your details and redeem 15% off your first booking.'}
            </p>
          </div>
        </section>
      </div>
    )
  }

  const redeemed = !!user?.couponRedeemed

  const copyAndBook = async () => {
    if (!redeemed) {
      try { await redeemCoupon() } catch { /* still allow copy */ }
    }
    try { await navigator.clipboard.writeText(FIRST_VISIT_CODE) } catch { /* empty */ }
  }

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>Welcome</p>
          <h1 className={styles.pageTitle}>{user?.name || 'Your profile'}</h1>
          <p className={styles.pageSubtitle}>{user?.email}</p>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.card}>
          <p className={s.label}>First-timer coupon</p>
          <p className={s.status}>{redeemed ? 'Redeemed — use this code at booking' : `Available — ${FIRST_VISIT_PERCENT}% off your first booking`}</p>
          <p className={s.code}>{FIRST_VISIT_CODE}</p>
          <div className={s.actions}>
            <button type="button" className={s.primary} onClick={copyAndBook}>
              {redeemed ? 'Copy code' : 'Redeem & copy'}
            </button>
            <Link to="/agendar" className={s.secondary}>Book now</Link>
            <button type="button" className={s.ghost} onClick={logout}>Log out</button>
          </div>
        </div>
      </section>
    </div>
  )
}
