import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import BeforeAfterCarousel from '../../components/BeforeAfterCarousel'
import { DEFAULT_REVIEWS } from '../../data/reviewsData'
import styles from './Home.module.css'

function getStoredReviews() {
  try {
    const raw = localStorage.getItem('tm_reviews')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {}
  return DEFAULT_REVIEWS
}

function useCountUp(target, duration = 1400) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let start = null
    const step = ts => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  return { count, ref }
}

export default function Home() {
  const { t } = useLanguage()
  const { count: clientCount, ref: statsRef } = useCountUp(1000)

  const featuredReviews = getStoredReviews()
    .filter(r => r.featured !== false)
    .slice(0, 3)

  const stats = [
    { value: '10+',         label: t('home', 'statsYears') },
    { value: `${clientCount}+`, label: t('home', 'statsClients'), animated: true },
    { value: '5.0',         label: t('home', 'statsReviews') },
  ]

  return (
    <div className={styles.page}>
      {/* Full-screen hero carousel */}
      <BeforeAfterCarousel />

      {/* Stats */}
      <section className={styles.stats} ref={statsRef}>
        {stats.map(s => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* Reviews */}
      <section className={styles.reviewsSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>{t('home', 'reviewsEyebrow')}</p>
          <h2 className={styles.sectionTitle}>{t('home', 'reviewsTitle')}</h2>
          <div className={styles.ratingBadge}>
            <span className={styles.ratingStars}>★★★★★</span>
            <span className={styles.ratingText}>5.0 · Google Reviews</span>
          </div>
        </div>
        <div className={styles.reviewsGrid}>
          {featuredReviews.map(r => (
            <div key={r.id || r.name} className={styles.reviewCard}>
              <div className={styles.reviewStars}>{'★'.repeat(r.stars)}</div>
              <p className={styles.reviewText}>"{r.text}"</p>
              <p className={styles.reviewName}>{r.name}</p>
            </div>
          ))}
        </div>
        <div className={styles.expCta}>
          <Link to="/avaliacoes" className={styles.heroSecondary}>{t('home', 'viewAllReviews')}</Link>
        </div>
      </section>
    </div>
  )
}
