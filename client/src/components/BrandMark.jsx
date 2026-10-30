export default function BrandMark({ size = 40, className, title = 'Nanoplasty by Thalita' }) {
  return (
    <img
      className={className}
      src="/logo.png"
      alt={title}
      width={size}
      height={size}
      decoding="async"
      style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
    />
  )
}
