export default function BrandMark({ size = 40, className, title = 'Nanoplasty by Thalita' }) {
  const height = Math.round((size * 36) / 32)

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={height}
      viewBox="0 0 32 36"
      role="img"
      aria-label={title}
    >
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="20"
        fontWeight="600"
        fill="#C9A46D"
      >
        N
      </text>
      <path
        d="M5 28.5 C 10 24.5, 13 32, 18.5 27.5 C 22 24.8, 25 26.5, 28 28"
        fill="none"
        stroke="#C9A46D"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  )
}
