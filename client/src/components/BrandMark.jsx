import styles from './BrandMark.module.css'

export default function BrandMark({ size = 36, className = '' }) {
  return (
    <svg
      className={`${styles.mark} ${className}`.trim()}
      viewBox="0 0 32 36"
      width={size}
      height={Math.round(size * 36 / 32)}
      aria-hidden="true"
      focusable="false"
    >
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="20"
        fontWeight="600"
        fill="currentColor"
      >
        N
      </text>
      <path
        d="M5 28.5 C 10 24.5, 13 32, 18.5 27.5 C 22 24.8, 25 26.5, 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  )
}
