import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './Booking.module.css'

const SERVICES = [
  { key: 'nano',  name: 'Brazilian Nanoplastia' },
  { key: 'botox', name: 'Brazilian Botox' },
  { key: 'deep',  name: 'Deep Treatment' },
]

const PERIODS = [
  { id: 'morning',   hint: '9:00 – 12:00' },
  { id: 'afternoon', hint: '12:00 – 17:00' },
  { id: 'evening',   hint: '17:00 – 20:00' },
]

const TOTAL = 5

function todayISO() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function fill(template, vars) {
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
    template,
  )
}

export default function Booking() {
  const { t } = useLanguage()
  const [params] = useSearchParams()
  const preselected = params.get('service') || ''

  const initialService = SERVICES.find(s => s.key === preselected || s.name === preselected)?.name || ''

  const [step, setStep] = useState(1)
  const [service, setService] = useState(initialService)
  const [date, setDate] = useState('')
  const [period, setPeriod] = useState('')
  const [booked, setBooked] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [flexible, setFlexible] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!date) { setBooked([]); return }
    setLoadingSlots(true)
    setPeriod('')
    fetch(`/api/appointments?view=availability&date=${date}`)
      .then(r => r.json())
      .then(data => setBooked(Array.isArray(data.booked) ? data.booked : []))
      .catch(() => setBooked([]))
      .finally(() => setLoadingSlots(false))
  }, [date])

  const periodLabel = (id) => t('booking', id) || id
  const stepLabel = (n) => fill(t('booking', 'stepOf'), { n, total: TOTAL })

  const canNext = () => {
    if (step === 1) return !!service
    if (step === 2) return !!date && !!period
    if (step === 3) return true
    if (step === 4) return !!name.trim() && (!!phone.trim() || !!email.trim())
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          email: email.trim() || null,
          service,
          date,
          time: period,
          notes: details.trim() || null,
          flexible,
          status: 'pending',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t('booking', 'failBooking'))
      setDone(true)
    } catch (err) {
      setError(err.message || t('booking', 'failGeneric'))
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.success}>
            <div className={styles.checkCircle}>✓</div>
            <h1 className={styles.successTitle}>{t('booking', 'successTitle')}</h1>
            <p className={styles.successText}>
              {fill(t('booking', 'successText'), {
                service,
                date,
                period: periodLabel(period),
              })}
            </p>
            <Link to="/" className={styles.homeLink}>{t('common', 'backHome')}</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{t('common', 'bookNow')}</p>
            <h1 className={styles.title}>{t('booking', 'title')}</h1>
          </div>
          <div className={styles.progress}>
            {Array.from({ length: TOTAL }, (_, i) => (
              <span key={i} className={`${styles.dot} ${i + 1 <= step ? styles.dotActive : ''}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>{stepLabel(1)}</p>
            <h2 className={styles.stepTitle}>{t('booking', 'step1Title')}</h2>
            <p className={styles.stepSub}>{t('booking', 'step1Sub')}</p>
            <div className={styles.serviceList}>
              {SERVICES.map(s => (
                <button
                  key={s.key}
                  type="button"
                  className={`${styles.serviceOption} ${service === s.name ? styles.serviceSelected : ''}`}
                  onClick={() => setService(s.name)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>{stepLabel(2)}</p>
            <h2 className={styles.stepTitle}>{t('booking', 'step2Title')}</h2>
            <p className={styles.stepSub}>{t('booking', 'step2Sub')}</p>

            <label className={styles.label}>{t('booking', 'dateLabel')}</label>
            <input
              type="date"
              className={styles.input}
              min={todayISO()}
              value={date}
              onChange={e => setDate(e.target.value)}
            />

            {date && (
              <>
                <label className={styles.label} style={{ marginTop: 20 }}>{t('booking', 'timeOfDayLabel')}</label>
                {loadingSlots ? (
                  <p className={styles.hint}>{t('booking', 'checkingSlots')}</p>
                ) : (
                  <div className={styles.periodGrid}>
                    {PERIODS.map(p => {
                      const taken = booked.includes(p.id)
                      return (
                        <button
                          key={p.id}
                          type="button"
                          disabled={taken}
                          className={`${styles.periodBtn} ${period === p.id ? styles.periodSelected : ''} ${taken ? styles.periodTaken : ''}`}
                          onClick={() => !taken && setPeriod(p.id)}
                        >
                          <span className={styles.periodName}>{periodLabel(p.id)}</span>
                          <span className={styles.periodHint}>{taken ? t('booking', 'unavailable') : p.hint}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>{stepLabel(3)}</p>
            <h2 className={styles.stepTitle}>{t('booking', 'step3Title')}</h2>
            <p className={styles.stepSub}>{t('booking', 'step3Sub')}</p>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={flexible}
                onChange={e => setFlexible(e.target.checked)}
              />
              <span>{t('booking', 'flexibleCheck')}</span>
            </label>
          </div>
        )}

        {step === 4 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>{stepLabel(4)}</p>
            <h2 className={styles.stepTitle}>{t('booking', 'step4Title')}</h2>
            <p className={styles.stepSub}>{t('booking', 'step4Sub')}</p>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>{t('booking', 'nameLabel')}</label>
                <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder={t('booking', 'namePlaceholder')} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('booking', 'phoneLabel')}</label>
                <input className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+61 450 000 000" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('booking', 'emailLabel')}</label>
                <input type="email" className={styles.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('booking', 'detailsLabel')}</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder={t('booking', 'detailsPlaceholder')}
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>{stepLabel(5)}</p>
            <h2 className={styles.stepTitle}>{t('booking', 'step5Title')}</h2>
            <p className={styles.stepSub}>{t('booking', 'step5Sub')}</p>
            <dl className={styles.summary}>
              <div><dt>{t('booking', 'summaryService')}</dt><dd>{service}</dd></div>
              <div><dt>{t('booking', 'summaryDate')}</dt><dd>{date}</dd></div>
              <div><dt>{t('booking', 'summaryTime')}</dt><dd>{periodLabel(period)}</dd></div>
              <div><dt>{t('booking', 'summaryFlexible')}</dt><dd>{flexible ? t('booking', 'yes') : t('booking', 'no')}</dd></div>
              <div><dt>{t('booking', 'summaryName')}</dt><dd>{name}</dd></div>
              {phone && <div><dt>{t('booking', 'summaryPhone')}</dt><dd>{phone}</dd></div>}
              {email && <div><dt>{t('booking', 'summaryEmail')}</dt><dd>{email}</dd></div>}
              {details && <div><dt>{t('booking', 'summaryDetails')}</dt><dd>{details}</dd></div>}
            </dl>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        )}

        <div className={styles.footer}>
          {step > 1 && (
            <button type="button" className={styles.backBtn} onClick={() => { setStep(s => s - 1); setError('') }}>
              {t('booking', 'back')}
            </button>
          )}
          {step < TOTAL ? (
            <button
              type="button"
              className={styles.nextBtn}
              disabled={!canNext()}
              onClick={() => setStep(s => s + 1)}
            >
              {t('booking', 'next')}
            </button>
          ) : (
            <button
              type="button"
              className={styles.nextBtn}
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? t('booking', 'sending') : t('booking', 'submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
