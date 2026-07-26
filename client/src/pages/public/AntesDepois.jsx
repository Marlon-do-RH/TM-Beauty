import { useState, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'
import s from './AntesDepois.module.css'

const FALLBACK_PAIRS = [
  { category: 'Nanoplastia', caption: 'Cabelo cacheado → liso sedoso' },
  { category: 'Botox', caption: 'Volume excessivo → fios controlados' },
  { category: 'Nanoplastia', caption: 'Frizz intenso → brilho natural' },
  { category: 'Deep Treatment', caption: 'Pontas ressecadas → fios hidratados' },
  { category: 'Botox', caption: 'Cabelo ondulado → levemente alisado' },
  { category: 'Nanoplastia', caption: 'Dano químico → restauração completa' },
]

export default function AntesDepois() {
  const { t } = useLanguage()
  const categories = [t('antesDepois', 'all'), 'Nanoplastia', 'Botox', 'Deep Treatment']
  const [active, setActive] = useState(categories[0])
  const [pairs, setPairs] = useState(FALLBACK_PAIRS)

  useEffect(() => {
    fetch('/api/gallery?section=gallery')
      .then(r => r.json())
      .then(data => Array.isArray(data) && data.length > 0 && setPairs(data.map(d => ({ ...d, label: d.caption }))))
      .catch(() => {})
  }, [])

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
              <div key={p.id || i} className={s.pairCard}>
                <div className={s.pairImages}>
                  <div className={s.pairImg} style={p.before_url ? { backgroundImage: `url(${p.before_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                    <span className={s.pairTag}>{t('antesDepois', 'before')}</span>
                  </div>
                  <div className={`${s.pairImg} ${s.pairImgAfter}`} style={p.after_url ? { backgroundImage: `url(${p.after_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                    <span className={s.pairTag}>{t('antesDepois', 'after')}</span>
                  </div>
                </div>
                <div className={s.pairInfo}>
                  <span className={s.pairCategory}>{p.category}</span>
                  <p className={s.pairLabel}>{p.caption || p.label}</p>
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
