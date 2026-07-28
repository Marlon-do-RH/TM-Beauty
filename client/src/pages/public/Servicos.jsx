import { useState, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'
import s from './Servicos.module.css'

const SERVICE_KEYS = [
  { key: 'nano', benefits: ['b1', 'b2', 'b3', 'b4'], icon: '✦' },
  { key: 'botox', benefits: ['b1', 'b2', 'b3', 'b4'], icon: '✧' },
  { key: 'deep', benefits: ['b1', 'b2', 'b3', 'b4'], icon: '◈' },
]

export default function Servicos() {
  const { t } = useLanguage()
  const [liveServices, setLiveServices] = useState([])

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setLiveServices(data))
      .catch(() => {})
  }, [])

  const services = SERVICE_KEYS.map((sk, i) => {
    const live = liveServices[i]
    return {
      ...sk,
      price: live ? `R$ ${live.price_min}` : (sk.key === 'nano' ? 'R$ 280' : sk.key === 'botox' ? 'R$ 220' : 'R$ 180'),
      duration: live ? `${live.duration}${live.duration_unit === 'horas' ? 'h' : 'min'}` : (sk.key === 'nano' ? '3–4h' : sk.key === 'botox' ? '2–3h' : '1–2h'),
    }
  })

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
                  <BookingButton
                    label={t('servicos', 'bookThis')}
                    variant="primary"
                    to={`/agendar?service=${sv.key}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
