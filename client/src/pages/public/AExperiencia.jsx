import { useLanguage } from '../../i18n/LanguageContext'
import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'
import s from './AExperiencia.module.css'

const amenityEmojis = ['☕', '🍫', '💆', '🌸', '📶', '🔋', '💧', '📖']
const amenityKeys = ['Premium Coffee', 'Brazilian Snacks', 'Massage Cushion', 'Relaxing Aroma', 'Free Wi-Fi', 'Phone Charging', 'Sparkling Water', 'Magazines']

export default function AExperiencia() {
  const { t } = useLanguage()

  const steps = [
    { num: '01', title: t('experiencia', 'step1Title'), desc: t('experiencia', 'step1Desc') },
    { num: '02', title: t('experiencia', 'step2Title'), desc: t('experiencia', 'step2Desc') },
    { num: '03', title: t('experiencia', 'step3Title'), desc: t('experiencia', 'step3Desc') },
    { num: '04', title: t('experiencia', 'step4Title'), desc: t('experiencia', 'step4Desc') },
  ]

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('experiencia', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('experiencia', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('experiencia', 'subtitle')}</p>
        </div>
      </section>

      <section className={s.introSection}>
        <div className={s.inner}>
          <div className={s.introGrid}>
            <div>
              <p className={styles.eyebrow}>{t('experiencia', 'philoEyebrow')}</p>
              <h2 className={styles.sectionTitle}>{t('experiencia', 'philoTitle')}</h2>
              <p className={s.introText}>{t('experiencia', 'intro1')}</p>
              <p className={s.introText}>{t('experiencia', 'intro2')}</p>
            </div>
            <div className={s.introVisual}>
              <div className={s.introPlaceholder} />
            </div>
          </div>
        </div>
      </section>

      <section className={s.amenitiesSection}>
        <div className={s.inner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>{t('experiencia', 'amenitiesEyebrow')}</p>
            <h2 className={styles.sectionTitle}>{t('experiencia', 'amenitiesTitle')}</h2>
          </div>
          <div className={s.amenitiesGrid}>
            {amenityKeys.map((key, i) => (
              <div key={key} className={s.amenityCard}>
                <span className={s.amenityIcon}>{amenityEmojis[i]}</span>
                <h3 className={s.amenityTitle}>{key}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.stepsSection}>
        <div className={s.inner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>{t('experiencia', 'stepsEyebrow')}</p>
            <h2 className={styles.sectionTitle}>{t('experiencia', 'stepsTitle')}</h2>
          </div>
          <div className={s.stepsGrid}>
            {steps.map(st => (
              <div key={st.num} className={s.stepCard}>
                <span className={s.stepNum}>{st.num}</span>
                <h3 className={s.stepTitle}>{st.title}</h3>
                <p className={s.stepDesc}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>{t('experiencia', 'ctaTitle')}</h2>
        <p className={styles.ctaText}>{t('experiencia', 'ctaText')}</p>
        <BookingButton label={t('experiencia', 'ctaBtn')} variant="primary" />
      </section>
    </div>
  )
}
