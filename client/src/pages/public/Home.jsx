import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import { useConsultation } from '../../layouts/PublicLayout'
import BookingButton from '../../components/BookingButton'
import BeforeAfterCarousel from '../../components/BeforeAfterCarousel'
import HairLengthCutter from '../../components/HairLengthCutter'
import styles from './Home.module.css'

const serviceKeys = [
  { key: 'nano', name: 'Nanoplasty', price: 'From A$280', icon: '✦' },
  { key: 'botox', name: 'Botox', price: 'From A$220', icon: '✧' },
  { key: 'deep', name: 'Deep Treatment', price: 'From A$180', icon: '◈' },
]

function FlagIcon({ children, label }) {
  return (
    <svg
      className={styles.langFlag}
      viewBox="0 0 24 16"
      width="22"
      height="15"
      aria-hidden="true"
      focusable="false"
    >
      <title>{label}</title>
      {children}
    </svg>
  )
}

const LANGUAGES = [
  {
    label: 'French',
    icon: (
      <FlagIcon label="French">
        <rect width="8" height="16" fill="#002654" />
        <rect x="8" width="8" height="16" fill="#fff" />
        <rect x="16" width="8" height="16" fill="#ed2939" />
      </FlagIcon>
    ),
  },
  {
    label: 'Portuguese',
    icon: (
      <FlagIcon label="Portuguese">
        <rect width="24" height="16" fill="#009b3a" />
        <polygon points="12,2 22,8 12,14 2,8" fill="#fedd00" />
        <circle cx="12" cy="8" r="3.2" fill="#002776" />
      </FlagIcon>
    ),
  },
  {
    label: 'Spanish',
    icon: (
      <FlagIcon label="Spanish">
        <rect width="24" height="16" fill="#c60b1e" />
        <rect y="4" width="24" height="8" fill="#ffc400" />
      </FlagIcon>
    ),
  },
  {
    label: 'English',
    icon: (
      <FlagIcon label="English">
        <rect width="24" height="16" fill="#012169" />
        <path d="M0 0l12 8M12 0L0 8" stroke="#fff" strokeWidth="1.8" />
        <path d="M0 0l12 8M12 0L0 8" stroke="#c8102e" strokeWidth="0.8" />
        <path d="M6 0v8M0 4h12" stroke="#fff" strokeWidth="2.8" />
        <path d="M6 0v8M0 4h12" stroke="#c8102e" strokeWidth="1.4" />
        <polygon points="6,9.4 6.7,11.4 4.6,10.2 7.4,10.2 5.3,11.4" fill="#fff" />
        <polygon points="16.5,3.2 17,4.8 15.4,3.8 17.6,3.8 16,4.8" fill="#fff" />
        <polygon points="20.2,6.4 20.6,7.6 19.3,6.9 21.1,6.9 19.8,7.6" fill="#fff" />
        <polygon points="19.4,10.6 19.8,11.8 18.5,11.1 20.3,11.1 19,11.8" fill="#fff" />
        <polygon points="15.6,8.6 15.9,9.5 14.9,9 16.3,9 15.3,9.5" fill="#fff" />
        <circle cx="17.2" cy="12.8" r="0.55" fill="#fff" />
      </FlagIcon>
    ),
  },
]

const reviews = [
  { name: 'Sarah M.', stars: 5, text: "Absolutely amazing! My hair has never felt this smooth. Thalita is a true artist — so professional and caring." },
  { name: 'Camila R.', stars: 5, text: "Incredible experience from start to finish. The studio is beautiful and the results are beyond what I expected." },
  { name: 'Jessica T.', stars: 5, text: "I've been going to Thalita for 2 years and I will never go anywhere else. The best hair treatment in Melbourne!" },
]

export default function Home() {
  const { t } = useLanguage()
  const openConsultation = useConsultation()
  const [teaserPair, setTeaserPair] = useState(null)

  useEffect(() => {
    fetch('/api/gallery?view=carousel')
      .then(r => r.json())
      .then(data => setTeaserPair(Array.isArray(data) && data.length > 0 ? data[0] : undefined))
      .catch(() => setTeaserPair(undefined))
  }, [])

  const stats = [
    { value: '10+', label: t('home', 'statsYears') },
    { value: '3', label: t('home', 'statsCountries') },
    { value: '1000+', label: t('home', 'statsClients') },
    { value: '5.0', label: t('home', 'statsReviews') },
  ]

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>{t('home', 'heroEyebrow')}</p>
          <h1 className={styles.heroTitle}>
            Thalita<br />
            <span className={styles.heroTitleAccent}>Medeiros</span>
          </h1>
          <p className={styles.heroTagline}>{t('home', 'heroTagline')}</p>
          <div className={styles.heroCtas}>
            <BookingButton label={t('nav', 'bookNow')} variant="primary" onClick={openConsultation} />
            <Link to="/servicos" className={styles.heroSecondary}>{t('home', 'viewServices')}</Link>
          </div>
          <p className={styles.langLine}>{t('home', 'languagesLine')}</p>
          <div className={styles.langRow}>
            {LANGUAGES.map(l => (
              <span key={l.label} className={styles.langItem}>
                {l.icon}
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.heroVisual}>
          <BeforeAfterCarousel />
        </div>
      </section>

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
              <h3 className={styles.serviceTitle}>{s.name}</h3>
              <p className={styles.serviceDesc}>{t('servicos', s.key)?.desc || ''}</p>
              <p className={styles.servicePrice}>{s.price}</p>
              <Link to="/servicos" className={styles.serviceLink}>{t('home', 'learnMore')}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Hair length guide */}
      <section className={styles.lengthSection}>
        <div className={styles.lengthSectionInner}>
          <HairLengthCutter />
        </div>
      </section>

      {/* Before/After teaser */}
      <section className={styles.teaserSection}>
        <div className={styles.teaserContent}>
          <p className={styles.eyebrow}>{t('home', 'beforeEyebrow')}</p>
          <h2 className={styles.teaserTitle}>{t('home', 'beforeTitle')}</h2>
          <p className={styles.teaserText}>{t('home', 'beforeText')}</p>
          <BookingButton label={t('home', 'viewBeforeAfter')} to="/before-after" variant="outline" />
        </div>
        <div className={styles.teaserVisual}>
          {teaserPair === null ? (
            <div className={styles.teaserSkeleton} />
          ) : teaserPair === undefined ? (
            <div className={styles.beforeAfterBox}>
              <div className={styles.beforeLabel}>{t('antesDepois', 'before')}</div>
              <div className={styles.afterLabel}>{t('antesDepois', 'after')}</div>
            </div>
          ) : (
            <div className={styles.beforeAfterBox}>
              <div
                className={styles.teaserImgBox}
                style={teaserPair.before_url ? { backgroundImage: `url(${teaserPair.before_url})` } : {}}
              >
                <span className={styles.teaserTag}>{t('antesDepois', 'before') || 'Before'}</span>
              </div>
              <div
                className={`${styles.teaserImgBox} ${styles.teaserImgAfter}`}
                style={teaserPair.after_url ? { backgroundImage: `url(${teaserPair.after_url})` } : {}}
              >
                <span className={styles.teaserTag}>{t('antesDepois', 'after') || 'After'}</span>
              </div>
            </div>
          )}
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
          {['☕ Premium Coffee', '🍫 Brazilian Snacks', '🌸 Relaxing Aroma',
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
        <BookingButton label={t('home', 'ctaBtn')} variant="primary" onClick={openConsultation} />
      </section>
    </div>
  )
}
