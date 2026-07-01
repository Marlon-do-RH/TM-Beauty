import { useLanguage } from '../../i18n/LanguageContext'
import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'
import s from './Servicos.module.css'

export default function Servicos() {
  const { t } = useLanguage()

  const services = [
    {
      key: 'nano',
      price: 'R$ 280',
      duration: '3–4h',
      benefits: ['b1', 'b2', 'b3', 'b4'],
      icon: '✦',
    },
    {
      key: 'botox',
      price: 'R$ 220',
      duration: '2–3h',
      benefits: ['b1', 'b2', 'b3', 'b4'],
      icon: '✧',
    },
    {
      key: 'deep',
      price: 'R$ 180',
      duration: '1–2h',
      benefits: ['b1', 'b2', 'b3', 'b4'],
      icon: '◈',
    },
  ]

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('servicos', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('servicos', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('servicos', 'subtitle')}</p>
        </div>
      </section>

      <section className={s.servicesSection}>
        <div className={s.inner}>
          {services.map((sv, i) => {
            const data = t('servicos', sv.key)
            return (
              <div key={sv.key} className={`${s.serviceRow} ${i % 2 !== 0 ? s.serviceRowReverse : ''}`}>
                <div className={s.serviceVisual}>
                  <div className={s.servicePlaceholder}>
                    <span className={s.servicePlaceholderIcon}>{sv.icon}</span>
                  </div>
                </div>
                <div className={s.serviceContent}>
                  <p className={styles.eyebrow}>{t('servicos', 'treatmentEyebrow')}</p>
                  <h2 className={s.serviceName}>{data?.name}</h2>
                  <p className={s.serviceTagline}>{data?.tagline}</p>
                  <p className={s.serviceDesc}>{data?.desc}</p>
                  <ul className={s.benefits}>
                    {sv.benefits.map(b => (
                      <li key={b} className={s.benefit}>
                        <span className={s.benefitDot}>✓</span> {data?.[b]}
                      </li>
                    ))}
                  </ul>
                  <div className={s.serviceMeta}>
                    <span className={s.servicePrice}>{t('servicos', 'from')} {sv.price}</span>
                    <span className={s.serviceDuration}>⏱ {sv.duration}</span>
                  </div>
                  <BookingButton label={t('servicos', 'bookThis')} variant="primary" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>{t('servicos', 'noSure')}</h2>
        <p className={styles.ctaText}>{t('servicos', 'noSureText')}</p>
        <BookingButton label={t('servicos', 'freeConsult')} variant="primary" to="/contato" />
      </section>
    </div>
  )
}
