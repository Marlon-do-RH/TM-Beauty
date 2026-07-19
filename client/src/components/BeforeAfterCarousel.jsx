import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './BeforeAfterCarousel.module.css'

export const BEFORE_AFTER_PAIRS = [
  { category: 'Nanoplastia',    label: 'Curly hair — silky smooth' },
  { category: 'Botox',          label: 'Excess volume — controlled frizz' },
  { category: 'Nanoplastia',    label: 'Intense frizz — natural shine' },
  { category: 'Deep Treatment', label: 'Dry ends — deeply hydrated' },
  { category: 'Botox',          label: 'Wavy hair — lightly smoothed' },
  { category: 'Nanoplastia',    label: 'Chemical damage — full restoration' },
]

const INTERVAL = 4000

function ArrowBtn({ dir, onClick }) {
  return (
    <button
      className={`${styles.arrow} ${dir === 'prev' ? styles.arrowPrev : styles.arrowNext}`}
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous' : 'Next'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dir === 'prev'
          ? <polyline points="15 18 9 12 15 6"/>
          : <polyline points="9 18 15 12 9 6"/>
        }
      </svg>
    </button>
  )
}

export default function BeforeAfterCarousel() {
  const { t } = useLanguage()
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [paused, setPaused] = useState(false)
  const nextIdx = useRef(0)
  const total = BEFORE_AFTER_PAIRS.length

  const goTo = useCallback((idx) => {
    nextIdx.current = (idx + total) % total
    setFading(true)
    setTimeout(() => {
      setCurrent(nextIdx.current)
      setFading(false)
    }, 350)
  }, [total])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(next, INTERVAL)
    return () => clearTimeout(t)
  }, [current, paused, next])

  const pair = BEFORE_AFTER_PAIRS[current]
  const beforeLabel = t('antesDepois', 'before') || 'Before'
  const afterLabel  = t('antesDepois', 'after')  || 'After'

  return (
    <section
      className={styles.root}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Image pair ── */}
      <div className={`${styles.slide} ${fading ? styles.slideOut : styles.slideIn}`}>
        <div className={styles.imgBefore}>
          <span className={styles.imgTag}>{beforeLabel}</span>
        </div>
        <div className={styles.imgAfter}>
          <span className={styles.imgTag}>{afterLabel}</span>
        </div>
      </div>

      {/* ── Centre divider ── */}
      <div className={styles.divider} aria-hidden="true" />

      {/* ── Brand overlay ── */}
      <div className={styles.brandOverlay} aria-hidden="true">
        <div className={styles.monogram}>TM</div>
        <div className={styles.ornament}>
          <span className={styles.ornLine} />
          <span className={styles.ornDiamond} />
          <span className={styles.ornLine} />
        </div>
        <p className={styles.brandName}>Thalita Medeiros</p>
        <p className={styles.brandSub}>Brazilian Hair Specialist · Melbourne</p>
      </div>

      {/* ── Prev / Next arrows ── */}
      <ArrowBtn dir="prev" onClick={prev} />
      <ArrowBtn dir="next" onClick={next} />

      {/* ── Bottom strip ── */}
      <div className={styles.bottomStrip}>
        <div className={`${styles.caption} ${fading ? styles.captionOut : styles.captionIn}`}>
          <span className={styles.captionCategory}>{pair.category}</span>
          <span className={styles.captionDot} aria-hidden="true">·</span>
          <span className={styles.captionLabel}>{pair.label}</span>
        </div>

        <div className={styles.dots}>
          {BEFORE_AFTER_PAIRS.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <Link to="/antes-depois" className={styles.cta}>
          View all transformations
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </section>
  )
}
