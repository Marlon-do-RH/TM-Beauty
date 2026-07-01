import { useLanguage } from '../../i18n/LanguageContext'
import styles from './PageCommon.module.css'
import s from './Avaliacoes.module.css'

const reviews = [
  { name: 'Sarah M.', date: 'January 2024', stars: 5, text: 'Absolutely amazing! My hair has never felt this smooth and shiny. Thalita is a true artist — so professional, caring, and knowledgeable.' },
  { name: 'Camila R.', date: 'February 2024', stars: 5, text: "Incredible experience from start to finish. Thalita really listens to what you want and the results are beyond what I expected. I've recommended her to all my friends." },
  { name: 'Jessica T.', date: 'March 2024', stars: 5, text: "I've been going to Thalita for 2 years and I will never go anywhere else. The best hair treatment in Melbourne!" },
  { name: 'Ana P.', date: 'March 2024', stars: 5, text: "The Nanoplastia treatment was life-changing. My hair used to take 45 minutes to style — now it's perfect in 10 minutes." },
  { name: 'Michelle K.', date: 'April 2024', stars: 5, text: "From the moment I walked in, I felt so welcome. The attention to detail is incredible — from the coffee to the massage cushion." },
  { name: 'Larissa O.', date: 'May 2024', stars: 5, text: 'Thalita is so talented and genuinely passionate about her work. I left the studio feeling like a new person.' },
]

const igReviews = [
  { handle: '@sarah_m', comment: "Just left @thalita.medeiros.hair and WOW. My hair is absolutely transformed 🙌✨ 5 stars doesn't even cover it!" },
  { handle: '@camila_rbx', comment: "Best decision I ever made booking with Thalita! The Brazilian Botox is unreal 😍 Book her now before she's fully booked!" },
  { handle: '@jess_style_mel', comment: "Couldn't be happier with my Nanoplastia results! @thalita.medeiros.hair is worth every cent 💆‍♀️" },
]

export default function Avaliacoes() {
  const { t } = useLanguage()

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('avaliacoes', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('avaliacoes', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('avaliacoes', 'subtitle')}</p>
        </div>
      </section>

      <section className={s.ratingHero}>
        <div className={s.inner}>
          <div className={s.ratingBig}>
            <span className={s.ratingNum}>5.0</span>
            <div>
              <div className={s.ratingStars}>★★★★★</div>
              <p className={s.ratingLabel}>Google Reviews</p>
              <a href="https://g.page/r/thalita-medeiros" target="_blank" rel="noreferrer" className={s.ratingLink}>
                {t('avaliacoes', 'viewOnGoogle')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={s.reviewsSection}>
        <div className={s.inner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>{t('avaliacoes', 'googleEyebrow')}</p>
            <h2 className={styles.sectionTitle}>{t('avaliacoes', 'googleTitle')}</h2>
          </div>
          <div className={s.reviewsGrid}>
            {reviews.map(r => (
              <div key={r.name} className={s.reviewCard}>
                <div className={s.reviewTop}>
                  <div className={s.avatar}>{r.name[0]}</div>
                  <div>
                    <p className={s.reviewName}>{r.name}</p>
                    <p className={s.reviewDate}>{r.date}</p>
                  </div>
                  <div className={s.reviewStars}>{'★'.repeat(r.stars)}</div>
                </div>
                <p className={s.reviewText}>"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.igSection}>
        <div className={s.inner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>{t('avaliacoes', 'igEyebrow')}</p>
            <h2 className={styles.sectionTitle}>{t('avaliacoes', 'igTitle')}</h2>
          </div>
          <div className={s.igGrid}>
            {igReviews.map(r => (
              <div key={r.handle} className={s.igCard}>
                <div className={s.igHeader}>
                  <div className={s.igAvatar}>📸</div>
                  <span className={s.igHandle}>{r.handle}</span>
                </div>
                <p className={s.igComment}>{r.comment}</p>
              </div>
            ))}
          </div>
          <div className={s.igCta}>
            <a href="https://instagram.com/thalita.medeiros.hair" target="_blank" rel="noreferrer" className={s.igLink}>
              {t('avaliacoes', 'viewAll')}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
