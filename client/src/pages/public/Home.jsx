import { Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import BookingButton from '../../components/BookingButton'
import BeforeAfterCarousel from '../../components/BeforeAfterCarousel'
import styles from './Home.module.css'

const serviceKeys = [
  { key: 'nano', price: 'a partir de R$280', icon: '✦' },
  { key: 'botox', price: 'a partir de R$220', icon: '✧' },
  { key: 'deep', price: 'a partir de R$180', icon: '◈' },
]

const reviews = [
  { name: 'Sarah M.', stars: 5, text: "Absolutely amazing! My hair has never felt this smooth. Thalita is a true artist — so professional and caring." },
  { name: 'Camila R.', stars: 5, text: "Incredible experience from start to finish. The studio is beautiful and the results are beyond what I expected." },
  { name: 'Jessica T.', stars: 5, text: "I've been going to Thalita for 2 years and I will never go anywhere else. The best hair treatment in Melbourne!" },
]

export default function Home() {
  const { t } = useLanguage()

  const stats = [
    { value: '10+', label: t('home', 'statsYears') },
    { value: '3', label: t('home', 'statsCountries') },
    { value: '1000+', label: t('home', 'statsClients') },
    { value: '5.0', label: t('home', 'statsReviews') },
  ]

  return (
    <div className={styles.page}>
      {/* Full-screen hero carousel */}
      <BeforeAfterCarousel />

      {/* Stats */}
      <section className={styles.stats}>
        {stats.map(s => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* Services preview */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>{t('home', 'servicesEyebrow')}</p>
          <h2 className={styles.sectionTitle}>{t('home', 'servicesTitle')}</h2>
          <p className={styles.sectionSub}>{t('home', 'servicesSub')}</p>
        </div>
        <div className={styles.servicesGrid}>
          {serviceKeys.map(s => (
            <div key={s.key} className={styles.serviceCard}>
              <span className={styles.serviceIcon}>{s.icon}</span>
              <h3 className={styles.serviceTitle}>{t('servicos', s.key)?.name || t('servicos', `${s.key}.name`)}</h3>
              <p className={styles.serviceDesc}>{t('servicos', s.key)?.desc || ''}</p>
              <p className={styles.servicePrice}>{s.price}</p>
              <Link to="/servicos" className={styles.serviceLink}>{t('home', 'learnMore')}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Before/After teaser */}
      <section className={styles.teaserSection}>
        <div className={styles.teaserContent}>
          <p className={styles.eyebrow}>{t('home', 'beforeEyebrow')}</p>
          <h2 className={styles.teaserTitle}>{t('home', 'beforeTitle')}</h2>
          <p className={styles.teaserText}>{t('home', 'beforeText')}</p>
          <BookingButton label={t('home', 'viewBeforeAfter')} to="/antes-depois" variant="outline" />
        </div>
        <div className={styles.teaserVisual}>
          <div className={styles.beforeAfterBox}>
            <div className={styles.beforeLabel}>{t('antesDepois', 'before')}</div>
            <div className={styles.afterLabel}>{t('antesDepois', 'after')}</div>
          </div>
        </div>
      </section>

      {/* Experience highlight */}
      <section className={styles.expSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>{t('home', 'expEyebrow')}</p>
          <h2 className={styles.sectionTitle}>{t('home', 'expTitle')}</h2>
          <p className={styles.sectionSub}>{t('home', 'expSub')}</p>
        </div>
        <div className={styles.amenities}>
          {['☕ Premium Coffee', '🍫 Brazilian Snacks', '💆 Massage Cushion', '🌸 Relaxing Aroma',
            '📶 Free Wi-Fi', '🔋 Phone Charging', '💧 Sparkling Water', '📖 Magazines'].map(a => (
            <div key={a} className={styles.amenity}>{a}</div>
          ))}
        </div>
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
          {reviews.map(r => (
            <div key={r.name} className={styles.reviewCard}>
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

      {/* Final CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>{t('home', 'ctaTitle')}</h2>
        <p className={styles.ctaText}>{t('home', 'ctaText')}</p>
        <BookingButton label={t('home', 'ctaBtn')} variant="primary" />
      </section>
    </div>
  )
}
