import { useState, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'
import s from './OStudio.module.css'

const STATIC_CAPTIONS = [
  'Área de tratamento principal',
  'Estação de lavagem',
  'Área de espera',
  'Produtos selecionados',
  'Detalhes do espaço',
  'O ambiente completo',
]

const CARD_SIZES = ['large', 'small', 'small', 'small', 'small', 'large']

export default function OStudio() {
  const { t } = useLanguage()
  const [studioPhotos, setStudioPhotos] = useState([])

  useEffect(() => {
    fetch('/api/site-media?section=studio')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setStudioPhotos(data))
      .catch(() => {})
  }, [])

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('studio', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('studio', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('studio', 'subtitle')}</p>
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

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>{t('studio', 'ctaTitle')}</h2>
        <p className={styles.ctaText}>{t('studio', 'ctaText')}</p>
        <BookingButton label={t('studio', 'ctaBtn')} variant="primary" />
      </section>
    </div>
  )
}
