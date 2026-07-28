import { useState, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
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

const FILTERS = [
  { id: 'all', labelKey: 'all' },
  { id: 'Nanoplastia' },
  { id: 'Botox' },
  { id: 'Deep Treatment' },
]

export default function AntesDepois() {
  const { t } = useLanguage()
  const [active, setActive] = useState('all')
  const [pairs, setPairs] = useState(null)

  useEffect(() => {
    fetch('/api/gallery?section=gallery')
      .then(r => r.json())
      .then(data => setPairs(Array.isArray(data) && data.length > 0 ? data.map(d => ({ ...d, label: d.caption })) : FALLBACK_PAIRS))
      .catch(() => setPairs(FALLBACK_PAIRS))
  }, [])

  const filtered = pairs
    ? (active === 'all' ? pairs : pairs.filter(p => p.category === active))
    : []

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
            {FILTERS.map(f => (
              <button
                key={f.id}
                className={`${s.filterBtn} ${active === f.id ? s.filterBtnActive : ''}`}
                onClick={() => setActive(f.id)}
              >
                {f.labelKey ? t('antesDepois', f.labelKey) : f.id}
              </button>
            ))}
          </div>

          {pairs === null ? (
            <div className={s.loadingRow}>
              <div className={s.spinner} />
            </div>
          ) : (
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
          )}
        </div>
      </section>
    </div>
  )
}
