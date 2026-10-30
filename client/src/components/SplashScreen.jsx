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

        <BrandMark size={120} className={styles.monogram} />

        <h1 className={styles.name}>Nanoplasty by Thalita</h1>

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
