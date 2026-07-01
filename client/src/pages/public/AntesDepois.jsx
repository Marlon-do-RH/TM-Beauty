import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'
import s from './AntesDepois.module.css'

const pairs = [
  { category: 'Nanoplastia', label: 'Cabelo cacheado → liso sedoso' },
  { category: 'Botox', label: 'Volume excessivo → fios controlados' },
  { category: 'Nanoplastia', label: 'Frizz intenso → brilho natural' },
  { category: 'Deep Treatment', label: 'Pontas ressecadas → fios hidratados' },
  { category: 'Botox', label: 'Cabelo ondulado → levemente alisado' },
  { category: 'Nanoplastia', label: 'Dano químico → restauração completa' },
]

export default function AntesDepois() {
  const { t } = useLanguage()
  const categories = [t('antesDepois', 'all'), 'Nanoplastia', 'Botox', 'Deep Treatment']
  const [active, setActive] = useState(categories[0])

  const filtered = active === categories[0] ? pairs : pairs.filter(p => p.category === active)

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('antesDepois', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('antesDepois', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('antesDepois', 'subtitle')}</p>
        </div>
      </section>

      <section className={s.gallerySection}>
        <div className={s.inner}>
          <div className={s.filterRow}>
            {categories.map(c => (
              <button
                key={c}
                className={`${s.filterBtn} ${active === c ? s.filterBtnActive : ''}`}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className={s.grid}>
            {filtered.map((p, i) => (
              <div key={i} className={s.pairCard}>
                <div className={s.pairImages}>
                  <div className={s.pairImg}>
                    <span className={s.pairTag}>{t('antesDepois', 'before')}</span>
                  </div>
                  <div className={`${s.pairImg} ${s.pairImgAfter}`}>
                    <span className={s.pairTag}>{t('antesDepois', 'after')}</span>
                  </div>
                </div>
                <div className={s.pairInfo}>
                  <span className={s.pairCategory}>{p.category}</span>
                  <p className={s.pairLabel}>{p.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>{t('antesDepois', 'ctaTitle')}</h2>
        <p className={styles.ctaText}>{t('antesDepois', 'ctaText')}</p>
        <BookingButton label={t('antesDepois', 'ctaBtn')} variant="primary" />
      </section>
    </div>
  )
}
