import { useState, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './PageCommon.module.css'

export default function SobreThalita() {
  const { t } = useLanguage()
  const [profilePhoto, setProfilePhoto] = useState(null)

  useEffect(() => {
    fetch('/api/site-media?section=about')
      .then(r => r.json())
      .then(data => Array.isArray(data) && data.length > 0 && setProfilePhoto(data[0].url))
      .catch(() => {})
  }, [])

  const values = [
    { icon: '✦', title: t('sobre', 'v1Title'), desc: t('sobre', 'v1Desc') },
    { icon: '♡', title: t('sobre', 'v2Title'), desc: t('sobre', 'v2Desc') },
    { icon: '◈', title: t('sobre', 'v3Title'), desc: t('sobre', 'v3Desc') },
    { icon: '✧', title: t('sobre', 'v4Title'), desc: t('sobre', 'v4Desc') },
  ]

  return (
    <div className={styles.sobrePage}>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('sobre', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('sobre', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('sobre', 'subtitle')}</p>
        </div>
      </section>

      <section className={styles.bioSection}>
        <div className={styles.bioGrid}>
          <div className={styles.bioVisual}>
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Thalita Medeiros"
                className={styles.bioProfileImg}
              />
            ) : (
              <div className={styles.bioImgPlaceholder}>
                <div className={styles.bioImgBadge}>
                  <span>Thalita Medeiros</span>
                  <span className={styles.bioImgSub}>Brazilian Hair Specialist</span>
                </div>
              </div>
            )}
          </div>
          <div className={styles.bioContent}>
            <p className={styles.eyebrow}>{t('sobre', 'storyEyebrow')}</p>
            <h2 className={styles.sectionTitle}>{t('sobre', 'storyTitle')}</h2>
            <p className={styles.bioText}>{t('sobre', 'bio1')}</p>
            <p className={styles.bioText}>{t('sobre', 'bio2')}</p>
            <p className={styles.bioText}>{t('sobre', 'bio3')}</p>
            <div className={styles.bioTimeline}>
              <div className={styles.bioTimelineItem}>
                <span className={styles.bioTimelineYear}>{t('sobre', 'brazil')}</span>
                <span className={styles.bioTimelineDesc}>{t('sobre', 'brazilDesc')}</span>
              </div>
              <div className={styles.bioTimelineItem}>
                <span className={styles.bioTimelineYear}>{t('sobre', 'france')}</span>
                <span className={styles.bioTimelineDesc}>{t('sobre', 'franceDesc')}</span>
              </div>
              <div className={styles.bioTimelineItem}>
                <span className={styles.bioTimelineYear}>{t('sobre', 'melbourne')}</span>
                <span className={styles.bioTimelineDesc}>{t('sobre', 'melbourneDesc')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.sobreDivider} aria-hidden="true">
        <span className={styles.sobreDivLine} />
        <span className={styles.sobreDivDiamond} />
        <span className={styles.sobreDivLine} />
      </div>

      <section className={styles.valuesSection}>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <p className={`${styles.eyebrow} ${styles.valuesEyebrow}`}>{t('sobre', 'valuesEyebrow')}</p>
            <h2 className={styles.sectionTitle}>{t('sobre', 'valuesTitle')}</h2>
          </div>
          <div className={styles.valuesGrid}>
            {values.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
