import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './BeforeAfterCarousel.module.css'

// Fallback shown ONLY if the API call fails entirely
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

  // null = still loading; array = ready (real data or fallback)
  const [pairs, setPairs]   = useState(null)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused]   = useState(false)
  const [animDir, setAnimDir] = useState('next')
  const [visible, setVisible] = useState(true)
  const timerRef = useRef(null)

  // Fetch data — only show something once resolved
  useEffect(() => {
    fetch('/api/gallery?view=carousel')
      .then(r => r.json())
      .then(data => setPairs(Array.isArray(data) && data.length > 0 ? data : FALLBACK_PAIRS))
      .catch(() => setPairs(FALLBACK_PAIRS))
  }, [])

  // Auto-advance — only runs when pairs is loaded
  useEffect(() => {
    if (!pairs || paused) return
    const total = pairs.length
    timerRef.current = setTimeout(() => {
      setAnimDir('next')
      setVisible(false)
      setTimeout(() => {
        setCurrent(c => (c + 1) % total)
        setVisible(true)
      }, 220)
    }, INTERVAL)
    return () => clearTimeout(timerRef.current)
  }, [current, paused, pairs])

  // Skeleton while loading
  if (!pairs) {
    return (
      <div className={styles.root}>
        <div className={styles.proofPill}>
          <span className={styles.proofStars}>★★★★★</span>
          <span className={styles.proofText}>5.0 · Google Reviews</span>
        </div>
        <div className={styles.skeleton} />
        <div className={styles.skeletonCaption} />
      </div>
    )
  }

  const total = pairs.length

  const goTo = (idx, dir = 'next') => {
    clearTimeout(timerRef.current)
    setAnimDir(dir)
    setVisible(false)
    setTimeout(() => {
      setCurrent((idx + total) % total)
      setVisible(true)
    }, 220)
  }

  const pair         = pairs[current]
  const beforeLabel  = t('antesDepois', 'before') || 'Before'
  const afterLabel   = t('antesDepois', 'after')  || 'After'

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
          <div
            className={styles.imgBox}
            style={pair.before_url ? { backgroundImage: `url(${pair.before_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            <span className={styles.imgTag}>{beforeLabel}</span>
          </div>
          <div
            className={`${styles.imgBox} ${styles.imgBoxAfter}`}
            style={pair.after_url ? { backgroundImage: `url(${pair.after_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            <span className={styles.imgTag}>{afterLabel}</span>
          </div>
        </div>

        <div className={styles.caption}>
          <span className={styles.captionCategory}>{pair.category}</span>
          <p className={styles.captionLabel}>{pair.caption || pair.label}</p>
        </div>
      </div>

      {/* Controls */}
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
          <button className={styles.arrow} onClick={() => goTo(current - 1, 'prev')} aria-label="Previous">
            <ChevronLeft />
          </button>
          <button className={styles.arrow} onClick={() => goTo(current + 1, 'next')} aria-label="Next">
            <ChevronRight />
          </button>
        </div>
      </div>

      <Link to="/antes-depois" className={styles.cta}>
        View all transformations
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </Link>
    </div>
  )
}
