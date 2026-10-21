import { useEffect, useId, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import BookingButton from './BookingButton'
import styles from './HairLengthCutter.module.css'

const MAX_CM = 60
const HAIR_TOP = 48
const HAIR_LEN = 376
const ZOOM_MS = 700

const VIEW_IDLE = { x: 0, y: 0, w: 200, h: 480 }
/* Close on head + full hair cascade — legs cropped, 0–60 cm still in frame */
const VIEW_ZOOM = { x: 32, y: 8, w: 136, h: 430 }

const CATEGORIES = [
  { id: 'short', maxCm: 20, labelKey: 'lengthShort', rangeKey: 'lengthShortRange' },
  { id: 'medium', maxCm: 35, labelKey: 'lengthMedium', rangeKey: 'lengthMediumRange' },
  { id: 'long', maxCm: 50, labelKey: 'lengthLong', rangeKey: 'lengthLongRange' },
  { id: 'extra', maxCm: Infinity, labelKey: 'lengthExtra', rangeKey: 'lengthExtraRange' },
]

function categoryForCm(cm) {
  return CATEGORIES.find(c => cm <= c.maxCm) || CATEGORIES[CATEGORIES.length - 1]
}

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function hasFineHover() {
  return typeof window !== 'undefined'
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function lerpView(a, b, t) {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    w: lerp(a.w, b.w, t),
    h: lerp(a.h, b.h, t),
  }
}

function formatViewBox(v) {
  return `${v.x} ${v.y} ${v.w} ${v.h}`
}

/** Map hair Y (SVG coords) into % of the current viewBox height */
function hairYToViewPercent(svgY, view) {
  return ((svgY - view.y) / view.h) * 100
}

const HAIR_MASS = `M72 48
  C60 70, 52 100, 48 140
  C44 190, 50 240, 54 290
  C58 330, 62 360, 68 390
  C74 410, 82 420, 90 424
  C96 400, 94 360, 96 320
  C98 280, 100 240, 100 200
  C100 240, 102 280, 104 320
  C106 360, 104 400, 110 424
  C118 420, 126 410, 132 390
  C138 360, 142 330, 146 290
  C150 240, 156 190, 152 140
  C148 100, 140 70, 128 48
  C120 36, 110 30, 100 30
  C90 30, 80 36, 72 48 Z`

function WomanFigure({ viewBox, cutPercent, falling, sway, uid }) {
  const clipTop = cutPercent == null ? 100 : cutPercent
  const keepH = (clipTop / 100) * HAIR_LEN + HAIR_TOP
  const cutY = (clipTop / 100) * HAIR_LEN + HAIR_TOP
  const keepId = `${uid}-keep`
  const fallId = `${uid}-fall`
  const hairGrad = `${uid}-hair`
  const skinGrad = `${uid}-skin`

  return (
    <svg
      className={`${styles.figureSvg} ${sway ? styles.sway : ''}`}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={hairGrad} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A3428" />
          <stop offset="30%" stopColor="#6B4E3D" />
          <stop offset="55%" stopColor="#8B6914" />
          <stop offset="80%" stopColor="#5C4033" />
          <stop offset="100%" stopColor="#3D2A1F" />
        </linearGradient>
        <linearGradient id={skinGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4B896" />
          <stop offset="55%" stopColor="#C4A484" />
          <stop offset="100%" stopColor="#A67C52" />
        </linearGradient>
        <clipPath id={keepId}>
          <rect x="0" y="0" width="200" height={keepH} />
        </clipPath>
        <clipPath id={fallId}>
          <rect x="0" y={keepH} width="200" height={480 - keepH} />
        </clipPath>
      </defs>

      <ellipse cx="100" cy="458" rx="44" ry="7" fill="rgba(74,52,40,0.14)" />

      {/* Soft torso */}
      <path
        d="M70 118
           C63 155, 59 205, 63 265
           C67 315, 73 365, 79 405
           L121 405
           C127 365, 133 315, 137 265
           C141 205, 137 155, 130 118
           Z"
        fill={`url(#${skinGrad})`}
        opacity="0.94"
      />

      {/* Soft shoulder curve */}
      <path
        d="M40 122
           C46 106, 64 98, 80 106
           L120 106
           C136 98, 154 106, 160 122
           C154 136, 136 140, 120 134
           L80 134
           C64 140, 46 136, 40 122
           Z"
        fill="#C4A484"
      />
      <path
        d="M40 122
           C46 106, 64 98, 80 106
           L120 106
           C136 98, 154 106, 160 122
           C154 130, 140 128, 120 124
           L80 124
           C60 128, 46 130, 40 122
           Z"
        fill="#D4B896"
        opacity="0.55"
      />

      <path
        d="M40 124 C26 165, 22 215, 28 275 C30 295, 36 304, 42 302 C38 252, 40 182, 52 142 Z"
        fill="#A67C52"
        opacity="0.88"
      />
      <path
        d="M160 124 C174 165, 178 215, 172 275 C170 295, 164 304, 158 302 C162 252, 160 182, 148 142 Z"
        fill="#A67C52"
        opacity="0.88"
      />

      <path
        d="M90 76 C88 92, 88 104, 90 114 L110 114 C112 104, 112 92, 110 76 Z"
        fill="#D4B896"
      />
      <ellipse cx="100" cy="56" rx="30" ry="34" fill="#D4B896" />
      <ellipse cx="100" cy="54" rx="26" ry="28" fill="#C4A484" opacity="0.35" />

      {/* Kept hair — layered strand groups */}
      <g clipPath={`url(#${keepId})`}>
        <g className={`${styles.strandGroup} ${styles.strandA}`}>
          <path d={HAIR_MASS} fill={`url(#${hairGrad})`} />
        </g>
        <g className={`${styles.strandGroup} ${styles.strandB}`}>
          <path
            d="M70 58 C54 120, 46 200, 54 285 C58 330, 68 375, 78 408"
            fill="none"
            stroke="#3D2A1F"
            strokeWidth="10"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />
          <path
            d="M82 50 C70 110, 64 180, 68 260 C72 320, 80 370, 88 410"
            fill="none"
            stroke="#5C4033"
            strokeWidth="6"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
        </g>
        <g className={`${styles.strandGroup} ${styles.strandC}`}>
          <path
            d="M100 32 C97 95, 95 170, 98 250 C100 320, 102 375, 100 418"
            fill="none"
            stroke="#C9A46D"
            strokeWidth="3"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />
          <path
            d="M108 48 C118 120, 122 200, 116 290 C112 340, 108 380, 112 415"
            fill="none"
            stroke="#8B6914"
            strokeWidth="4"
            strokeOpacity="0.35"
            strokeLinecap="round"
          />
        </g>
        <g className={`${styles.strandGroup} ${styles.strandD}`}>
          <path
            d="M130 58 C146 120, 154 200, 146 285 C142 330, 132 375, 122 408"
            fill="none"
            stroke="#3D2A1F"
            strokeWidth="10"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />
          <path
            d="M118 50 C130 110, 136 180, 132 260 C128 320, 120 370, 112 410"
            fill="none"
            stroke="#5C4033"
            strokeWidth="6"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Falling clumps after cut */}
      {cutPercent != null && (
        <g clipPath={`url(#${fallId})`}>
          <g className={`${styles.fallClump} ${falling ? styles.fallA : ''}`}>
            <path d={HAIR_MASS} fill={`url(#${hairGrad})`} opacity="0.95" />
          </g>
          <g className={`${styles.fallClump} ${falling ? styles.fallB : ''}`}>
            <path
              d="M70 58 C54 120, 46 200, 54 285 C58 330, 68 375, 78 408"
              fill="none"
              stroke="#3D2A1F"
              strokeWidth="10"
              strokeOpacity="0.5"
              strokeLinecap="round"
            />
            <path
              d="M82 50 C70 110, 64 180, 68 260 C72 320, 80 370, 88 410"
              fill="none"
              stroke="#5C4033"
              strokeWidth="7"
              strokeOpacity="0.55"
              strokeLinecap="round"
            />
          </g>
          <g className={`${styles.fallClump} ${falling ? styles.fallC : ''}`}>
            <path
              d="M130 58 C146 120, 154 200, 146 285 C142 330, 132 375, 122 408"
              fill="none"
              stroke="#3D2A1F"
              strokeWidth="10"
              strokeOpacity="0.5"
              strokeLinecap="round"
            />
            <path
              d="M118 50 C130 110, 136 180, 132 260 C128 320, 120 370, 112 410"
              fill="none"
              stroke="#5C4033"
              strokeWidth="7"
              strokeOpacity="0.55"
              strokeLinecap="round"
            />
          </g>
        </g>
      )}

      {cutPercent != null && (
        <line
          className={styles.cutLineSvg}
          x1="46"
          x2="154"
          y1={cutY}
          y2={cutY}
          stroke="#C9A46D"
          strokeWidth="2.2"
        />
      )}
    </svg>
  )
}

export default function HairLengthCutter() {
  const { t } = useLanguage()
  const uid = useId().replace(/:/g, '')
  const hairRef = useRef(null)
  const viewRef = useRef({ ...VIEW_IDLE })
  const rafRef = useRef(0)

  const [view, setView] = useState(VIEW_IDLE)
  const [zoomed, setZoomed] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [fineHover, setFineHover] = useState(true)
  const [cutPercent, setCutPercent] = useState(null)
  const [falling, setFalling] = useState(false)
  const [result, setResult] = useState(null)
  const [hoverY, setHoverY] = useState(null)

  useEffect(() => {
    const fine = hasFineHover()
    setFineHover(fine)
    if (!fine) setZoomed(true)
  }, [])

  useEffect(() => {
    const target = zoomed ? VIEW_ZOOM : VIEW_IDLE
    const from = { ...viewRef.current }

    if (prefersReducedMotion()) {
      viewRef.current = target
      setView(target)
      setCameraReady(zoomed)
      return undefined
    }

    setCameraReady(false)
    const start = performance.now()
    cancelAnimationFrame(rafRef.current)

    const tick = (now) => {
      const t = Math.min((now - start) / ZOOM_MS, 1)
      const next = lerpView(from, target, easeOutCubic(t))
      viewRef.current = next
      setView(next)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setCameraReady(zoomed)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [zoomed])

  const canCut = zoomed && cameraReady && !result

  /* Hair strip as % of the SVG element for the current (or target zoom) framing */
  const frame = zoomed ? VIEW_ZOOM : view
  const hairTopPct = hairYToViewPercent(HAIR_TOP, frame)
  const hairHPct = (HAIR_LEN / frame.h) * 100

  const handlePointerEnter = () => {
    if (result) return
    setZoomed(true)
  }

  const handlePointerLeave = () => {
    if (result) return
    setHoverY(null)
    if (fineHover) setZoomed(false)
  }

  const handleHairMove = (e) => {
    if (!canCut || !hairRef.current) return
    const rect = hairRef.current.getBoundingClientRect()
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height)
    setHoverY((y / rect.height) * 100)
  }

  const handleHairLeave = () => {
    if (!result) setHoverY(null)
  }

  const handleCut = (e) => {
    if (!canCut || !hairRef.current) return
    e.stopPropagation()
    const rect = hairRef.current.getBoundingClientRect()
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height)
    const percent = (y / rect.height) * 100
    const cm = Math.round(Math.min(Math.max((y / rect.height) * MAX_CM, 1), MAX_CM))
    const cat = categoryForCm(cm)

    setCutPercent(percent)
    setHoverY(null)
    setFalling(true)

    const reveal = () => {
      setResult({
        cm,
        id: cat.id,
        label: t('home', cat.labelKey),
        range: t('home', cat.rangeKey),
      })
    }

    if (prefersReducedMotion()) {
      reveal()
    } else {
      setTimeout(reveal, 700)
    }
  }

  const handleStageTap = () => {
    if (result || zoomed) return
    setZoomed(true)
  }

  const handleReset = () => {
    setCutPercent(null)
    setFalling(false)
    setResult(null)
    setHoverY(null)
    setZoomed(!fineHover)
  }

  return (
    <div className={styles.root}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{t('home', 'lengthEyebrow')}</p>
        <h2 className={styles.title}>{t('home', 'lengthTitle')}</h2>
        <p className={styles.sub}>{t('home', 'lengthSub')}</p>

        {!result ? (
          <p className={styles.prompt}>
            {zoomed ? t('home', 'lengthPromptCut') : t('home', 'lengthPromptZoom')}
          </p>
        ) : (
          <div className={styles.result} role="status">
            <p className={styles.resultLabel}>{t('home', 'lengthYourLength')}</p>
            <h3 className={styles.resultCategory}>{result.label}</h3>
            <p className={styles.resultRange}>{result.range}</p>
            <p className={styles.resultCm}>≈ {result.cm} cm</p>
            <p className={styles.howTo}>
              <strong>{t('home', 'lengthHowTitle')}</strong>
              {' '}
              {t('home', 'lengthHowText')}
            </p>
            <p className={styles.note}>{t('home', 'lengthNote')}</p>
            <div className={styles.resultActions}>
              <BookingButton
                label={t('home', 'lengthBookCta')}
                variant="primary"
              />
              <button type="button" className={styles.resetBtn} onClick={handleReset}>
                {t('home', 'lengthTryAgain')}
              </button>
            </div>
          </div>
        )}

        <ul className={styles.legend} aria-label={t('home', 'lengthTitle')}>
          {CATEGORIES.map(c => (
            <li
              key={c.id}
              className={result?.id === c.id ? styles.legendActive : undefined}
            >
              <span className={styles.legendName}>{t('home', c.labelKey)}</span>
              <span className={styles.legendRange}>{t('home', c.rangeKey)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`${styles.interactive} ${zoomed ? styles.interactiveZoomed : ''}`}
        onPointerEnter={fineHover ? handlePointerEnter : undefined}
        onPointerLeave={fineHover ? handlePointerLeave : undefined}
        onClick={!fineHover && !zoomed ? handleStageTap : undefined}
      >
        <div className={`${styles.stage} ${zoomed ? styles.stageZoomed : ''}`}>
          <WomanFigure
            viewBox={formatViewBox(view)}
            cutPercent={cutPercent}
            falling={falling}
            sway={!zoomed && !result}
            uid={uid}
          />

          {zoomed && (
            <>
              <div
                className={`${styles.ruler} ${cameraReady ? styles.rulerVisible : ''}`}
                aria-hidden="true"
                style={{ top: `${hairTopPct}%`, height: `${hairHPct}%` }}
              >
                {[0, 20, 35, 50, 60].map(cm => (
                  <span
                    key={cm}
                    className={styles.rulerMark}
                    style={{ top: `${(cm / MAX_CM) * 100}%` }}
                  >
                    {cm} cm
                  </span>
                ))}
              </div>

              <button
                type="button"
                ref={hairRef}
                className={`${styles.hairHit} ${cameraReady ? styles.hairHitReady : ''} ${result ? styles.hairDone : ''}`}
                style={{ top: `${hairTopPct}%`, height: `${hairHPct}%` }}
                onClick={handleCut}
                onPointerMove={handleHairMove}
                onPointerLeave={handleHairLeave}
                disabled={!!result || !cameraReady}
                aria-label={t('home', 'lengthPromptCut')}
              >
                {hoverY != null && !result && (
                  <div className={styles.hoverGuide} style={{ top: `${hoverY}%` }} />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
