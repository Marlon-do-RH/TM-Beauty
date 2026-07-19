import { useEffect } from 'react'
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

        {/* Monogram */}
        <div className={styles.monogram}>TM</div>

        {/* Brand name */}
        <h1 className={styles.name}>Thalita Medeiros</h1>

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
