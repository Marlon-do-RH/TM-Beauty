import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../../context/AdminAuth'
import styles from './PageCommon.module.css'
import s from './Profile.module.css'

const CODE = 'WELCOME10'

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
                : 'Sign in or register to see your details and redeem a first-visit coupon.'}
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
    try { await navigator.clipboard.writeText(CODE) } catch { /* empty */ }
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
          <p className={s.status}>{redeemed ? 'Redeemed — use this code at booking' : 'Available — 10% off your first visit'}</p>
          <p className={s.code}>{CODE}</p>
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
