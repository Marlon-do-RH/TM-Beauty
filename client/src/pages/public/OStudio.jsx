import { useLanguage } from '../../i18n/LanguageContext'
import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'
import s from './OStudio.module.css'

const photos = [
  { size: 'large', caption: 'Área de tratamento principal' },
  { size: 'small', caption: 'Estação de lavagem' },
  { size: 'small', caption: 'Área de espera' },
  { size: 'small', caption: 'Produtos selecionados' },
  { size: 'small', caption: 'Detalhes do espaço' },
  { size: 'large', caption: 'O ambiente completo' },
]

export default function OStudio() {
  const { t } = useLanguage()

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('studio', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('studio', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('studio', 'subtitle')}</p>
        </div>
      </section>

      <section className={s.introSection}>
        <div className={s.inner}>
          <div className={s.introText}>
            <p className={styles.eyebrow}>Melbourne · Australia</p>
            <h2 className={styles.sectionTitle}>{t('studio', 'title')}</h2>
            <p className={s.text}>{t('studio', 'subtitle')}</p>
          </div>
        </div>
      </section>

      <section className={s.gallerySection}>
        <div className={s.inner}>
          <div className={s.galleryGrid}>
            {photos.map((p, i) => (
              <div key={i} className={`${s.photoCard} ${p.size === 'large' ? s.photoCardLarge : ''}`}>
                <div className={s.photoPlaceholder} />
                <p className={s.photoCaption}>{p.caption}</p>
              </div>
            ))}
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
