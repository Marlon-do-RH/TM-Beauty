import { useState, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './PageCommon.module.css'
import s from './AntesDepois.module.css'

const PAGE_SIZE = 6

const FALLBACK_PAIRS = [
  { category: 'Nanoplastia', caption: 'Curly hair → silky straight' },
  { category: 'Botox', caption: 'Excess volume → controlled strands' },
  { category: 'Nanoplastia', caption: 'Intense frizz → natural shine' },
  { category: 'Deep Treatment', caption: 'Dry ends → hydrated hair' },
  { category: 'Botox', caption: 'Wavy hair → lightly smoothed' },
  { category: 'Nanoplastia', caption: 'Chemical damage → full restoration' },
]

const FILTERS = [
  { id: 'all', labelKey: 'all' },
  { id: 'Nanoplastia' },
  { id: 'Botox' },
  { id: 'Deep Treatment' },
]

function fill(template, vars) {
  return Object.entries(vars).reduce(
    (str, [k, v]) => str.replaceAll(`{${k}}`, String(v)),
    template,
  )
}

export default function AntesDepois() {
  const { t } = useLanguage()
  const [active, setActive] = useState('all')
  const [page, setPage] = useState(1)
  const [pairs, setPairs] = useState(null)

  useEffect(() => {
    fetch('/api/gallery?section=gallery')
      .then(r => r.json())
      .then(data => setPairs(Array.isArray(data) && data.length > 0 ? data.map(d => ({ ...d, label: d.caption })) : FALLBACK_PAIRS))
      .catch(() => setPairs(FALLBACK_PAIRS))
  }, [])

  const setFilter = (id) => {
    setActive(id)
    setPage(1)
  }

  const filtered = pairs
    ? (active === 'all' ? pairs : pairs.filter(p => p.category === active))
    : []

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

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
                onClick={() => setFilter(f.id)}
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
            <>
              <div className={s.grid}>
                {paged.map((p, i) => (
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

              {filtered.length > PAGE_SIZE && (
                <div className={s.pagination}>
                  <button
                    type="button"
                    className={s.pageBtn}
                    disabled={safePage <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    {t('antesDepois', 'prevPage')}
                  </button>
                  <span className={s.pageInfo}>
                    {fill(t('antesDepois', 'pageOf'), { current: safePage, total: totalPages })}
                  </span>
                  <button
                    type="button"
                    className={s.pageBtn}
                    disabled={safePage >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    {t('antesDepois', 'nextPage')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
