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
  { id: 'morning',   label: 'Morning',   hint: '9:00 – 12:00' },
  { id: 'afternoon', label: 'Afternoon', hint: '12:00 – 17:00' },
  { id: 'evening',   label: 'Night',     hint: '17:00 – 20:00' },
]

const TOTAL = 5

function todayISO() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
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

  // Load availability when date changes
  useEffect(() => {
    if (!date) { setBooked([]); return }
    setLoadingSlots(true)
    setPeriod('')
    fetch(`/api/appointments/availability?date=${date}`)
      .then(r => r.json())
      .then(data => setBooked(Array.isArray(data.booked) ? data.booked : []))
      .catch(() => setBooked([]))
      .finally(() => setLoadingSlots(false))
  }, [date])

  const periodLabel = (id) => PERIODS.find(p => p.id === id)?.label || id

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
      if (!res.ok) throw new Error(data.error || 'Booking failed')
      setDone(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
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
            <h1 className={styles.successTitle}>Booking request sent!</h1>
            <p className={styles.successText}>
              We received your request for <strong>{service}</strong> on <strong>{date}</strong> ({periodLabel(period)}).
              We will confirm as soon as possible. A confirmation email will be sent later.
            </p>
            <Link to="/" className={styles.homeLink}>Back to Home</Link>
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
            <p className={styles.eyebrow}>{t('common', 'bookNow') || 'Book'}</p>
            <h1 className={styles.title}>Book Your Appointment</h1>
          </div>
          <div className={styles.progress}>
            {Array.from({ length: TOTAL }, (_, i) => (
              <span key={i} className={`${styles.dot} ${i + 1 <= step ? styles.dotActive : ''}`} />
            ))}
          </div>
        </div>

        {/* Step 1 — Service */}
        {step === 1 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>Step 1 of {TOTAL}</p>
            <h2 className={styles.stepTitle}>Which service?</h2>
            <p className={styles.stepSub}>Select the treatment you would like to book.</p>
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

        {/* Step 2 — Date + period */}
        {step === 2 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>Step 2 of {TOTAL}</p>
            <h2 className={styles.stepTitle}>Choose a date & time of day</h2>
            <p className={styles.stepSub}>Slots already booked by another customer will not be available.</p>

            <label className={styles.label}>Date</label>
            <input
              type="date"
              className={styles.input}
              min={todayISO()}
              value={date}
              onChange={e => setDate(e.target.value)}
            />

            {date && (
              <>
                <label className={styles.label} style={{ marginTop: 20 }}>Time of day</label>
                {loadingSlots ? (
                  <p className={styles.hint}>Checking availability…</p>
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
                          <span className={styles.periodName}>{p.label}</span>
                          <span className={styles.periodHint}>{taken ? 'Unavailable' : p.hint}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 3 — Flexible */}
        {step === 3 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>Step 3 of {TOTAL}</p>
            <h2 className={styles.stepTitle}>Are you flexible?</h2>
            <p className={styles.stepSub}>
              Let us know if you can adjust the date or time of day if needed.
            </p>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={flexible}
                onChange={e => setFlexible(e.target.checked)}
              />
              <span>Yes, I am flexible with the date and/or time of day</span>
            </label>
          </div>
        )}

        {/* Step 4 — Contact */}
        {step === 4 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>Step 4 of {TOTAL}</p>
            <h2 className={styles.stepTitle}>Your contact details</h2>
            <p className={styles.stepSub}>We need at least a name and a phone number or email.</p>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>Name *</label>
                <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone</label>
                <input className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+61 450 000 000" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input type="email" className={styles.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Details / notes</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="Anything we should know about your hair or preferences…"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5 — Summary */}
        {step === 5 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>Step 5 of {TOTAL}</p>
            <h2 className={styles.stepTitle}>Review your request</h2>
            <p className={styles.stepSub}>Please confirm everything looks correct before sending.</p>
            <dl className={styles.summary}>
              <div><dt>Service</dt><dd>{service}</dd></div>
              <div><dt>Date</dt><dd>{date}</dd></div>
              <div><dt>Time of day</dt><dd>{periodLabel(period)}</dd></div>
              <div><dt>Flexible</dt><dd>{flexible ? 'Yes' : 'No'}</dd></div>
              <div><dt>Name</dt><dd>{name}</dd></div>
              {phone && <div><dt>Phone</dt><dd>{phone}</dd></div>}
              {email && <div><dt>Email</dt><dd>{email}</dd></div>}
              {details && <div><dt>Details</dt><dd>{details}</dd></div>}
            </dl>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        )}

        <div className={styles.footer}>
          {step > 1 && (
            <button type="button" className={styles.backBtn} onClick={() => { setStep(s => s - 1); setError('') }}>
              Back
            </button>
          )}
          {step < TOTAL ? (
            <button
              type="button"
              className={styles.nextBtn}
              disabled={!canNext()}
              onClick={() => setStep(s => s + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className={styles.nextBtn}
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Sending…' : 'Submit Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
