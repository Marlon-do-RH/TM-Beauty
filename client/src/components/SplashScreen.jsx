import { useEffect } from 'react'
import BrandMark from './BrandMark'
import styles from './SplashScreen.module.css'

export default function SplashScreen({ onDone }) {
  useEffect(() => {
    // Total animation is 1.8s — unmount after it completes
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.content}>
        {/* Decorative line above */}
        <div className={styles.ornament}>
          <span className={styles.ornLine} />
          <span className={styles.ornDiamond} />
          <span className={styles.ornLine} />
        </div>

        <BrandMark size={72} className={styles.monogram} />

        {/* Brand name */}
        <h1 className={styles.name}>Nanoplasty by Thalita</h1>

        {/* Tagline */}
        <p className={styles.tagline}>Brazilian Hair Specialist · Melbourne</p>

        {/* Decorative line below */}
        <div className={styles.ornament}>
          <span className={styles.ornLine} />
          <span className={styles.ornDiamond} />
          <span className={styles.ornLine} />
        </div>
      </div>
    </div>
  )
}
