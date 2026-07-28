import { useState, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'
import s from './OStudio.module.css'

const STATIC_CAPTIONS = [
  'Main treatment area',
  'Wash station',
  'Waiting area',
  'Selected products',
]

const CARD_SIZES = ['large', 'small', 'small', 'large']

export default function SobreThalita() {
  const { t } = useLanguage()
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [studioPhotos, setStudioPhotos] = useState([])

  useEffect(() => {
    fetch('/api/site-media?section=about')
      .then(r => r.json())
      .then(data => Array.isArray(data) && data.length > 0 && setProfilePhoto(data[0].url))
      .catch(() => {})

    fetch('/api/site-media?section=studio')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setStudioPhotos(data))
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

      <section className={s.gallerySection}>
        <div className={s.inner}>
          <div className={s.galleryGrid}>
            {CARD_SIZES.map((size, i) => {
              const photo = studioPhotos[i]
              const caption = photo?.caption || STATIC_CAPTIONS[i]
              return (
                <div key={i} className={`${s.photoCard} ${size === 'large' ? s.photoCardLarge : ''}`}>
                  {photo ? (
                    <img src={photo.url} alt={caption} className={s.photoImg} />
                  ) : (
                    <div className={s.photoPlaceholder} />
                  )}
                  <p className={s.photoCaption}>{caption}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className={s.locationSection}>
        <div className={s.inner}>
          <div className={s.locationGrid}>
            <div>
              <p className={styles.eyebrow}>{t('studio', 'locationEyebrow')}</p>
              <h2 className={styles.sectionTitle}>{t('studio', 'locationTitle')}</h2>
              <p className={s.text}>Melbourne, Victoria, Australia</p>
              <div className={s.locationDetails}>
                <p>📍 Melbourne, VIC, Australia</p>
                <p>📞 +61 400 000 000</p>
                <p>📧 hello@thalitamedeiros.com.au</p>
                <p>⏰ {t('studio', 'monFri')}: 9h–18h · {t('studio', 'sat')}: 9h–15h</p>
              </div>
              <BookingButton label={t('studio', 'directions')} to="/contato" variant="outline" />
            </div>
            <div className={s.mapPlaceholder}>
              <div className={s.mapInner}>
                <span>📍 Melbourne, Australia</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
