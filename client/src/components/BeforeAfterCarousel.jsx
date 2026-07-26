import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './BeforeAfterCarousel.module.css'

// Fallback shown while loading or if no gallery items exist yet
const FALLBACK_PAIRS = [
  { category: 'Nanoplastia',    caption: 'Curly hair → silky smooth',        before_url: '', after_url: '' },
  { category: 'Botox',          caption: 'Excess volume → controlled frizz', before_url: '', after_url: '' },
  { category: 'Deep Treatment', caption: 'Dry ends → deeply hydrated',       before_url: '', after_url: '' },
]

const INTERVAL = 3500

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}

export default function BeforeAfterCarousel() {
  const { t } = useLanguage()
  const [pairs, setPairs] = useState(FALLBACK_PAIRS)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [animDir, setAnimDir] = useState('next')
  const [visible, setVisible] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    fetch('/api/gallery?view=carousel')
      .then(r => r.json())
      .then(data => Array.isArray(data) && data.length > 0 && setPairs(data))
      .catch(() => {})
  }, [])

  const total = pairs.length

  const goTo = useCallback((idx, dir = 'next') => {
    setAnimDir(dir)
    setVisible(false)
    setTimeout(() => {
      setCurrent((idx + total) % total)
      setVisible(true)
    }, 220)
  }, [total])

  const next = useCallback(() => goTo(current + 1, 'next'), [current, goTo])
  const prev = useCallback(() => goTo(current - 1, 'prev'), [current, goTo])

  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(next, INTERVAL)
    return () => clearTimeout(timerRef.current)
  }, [current, paused, next])

  const pair = pairs[current]
  const beforeLabel = t('antesDepois', 'before') || 'Before'
  const afterLabel  = t('antesDepois', 'after')  || 'After'

  return (
    <div
      className={styles.root}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Social proof pill */}
      <div className={styles.proofPill}>
        <span className={styles.proofStars}>★★★★★</span>
        <span className={styles.proofText}>5.0 · Google Reviews</span>
      </div>

      {/* Slide */}
      <div className={`${styles.slide} ${visible ? styles.slideIn : styles.slideOut} ${animDir === 'next' ? styles.dirNext : styles.dirPrev}`}>
        <div className={styles.images}>
          {/* Before */}
          <div
            className={styles.imgBox}
            style={pair.before_url ? { backgroundImage: `url(${pair.before_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            <span className={styles.imgTag}>{beforeLabel}</span>
          </div>
          {/* After */}
          <div
            className={`${styles.imgBox} ${styles.imgBoxAfter}`}
            style={pair.after_url ? { backgroundImage: `url(${pair.after_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            <span className={styles.imgTag}>{afterLabel}</span>
          </div>
        </div>

        {/* Caption */}
        <div className={styles.caption}>
          <span className={styles.captionCategory}>{pair.category}</span>
          <p className={styles.captionLabel}>{pair.caption || pair.label}</p>
        </div>
      </div>

      {/* Controls row */}
      <div className={styles.controls}>
        <div className={styles.dots}>
          {pairs.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => goTo(i, i > current ? 'next' : 'prev')}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <div className={styles.arrows}>
          <button className={styles.arrow} onClick={prev} aria-label="Previous">
            <ChevronLeft />
          </button>
          <button className={styles.arrow} onClick={next} aria-label="Next">
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* CTA */}
      <Link to="/antes-depois" className={styles.cta}>
        View all transformations
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </Link>
    </div>
  )
}
