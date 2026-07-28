import { useState, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { IconPhone, IconWhatsApp, IconMail, IconInstagram, IconUpload } from '../../components/AdminIcons'
import styles from './PageCommon.module.css'
import s from './Contato.module.css'

const FALLBACK = {
  phone: '+61 450 442 869', whatsapp: '61450442869',
  email: 'hello@thalitamedeiros.com.au', instagram: 'thalita.medeiros.hair',
  address: '100 Wells St, Southbank VIC 3006',
  map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.3812385175224!2d144.96832229999998!3d-37.827959899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642aec9189039%3A0xf471078d67ce75d1!2s100%20Wells%20St%2C%20Southbank%20VIC%203006!5e0!3m2!1sen!2sau!4v1784464790192!5m2!1sen!2sau',
  hours_mon: '9:00 – 18:00',
  hours_tue: '9:00 – 18:00',
  hours_wed: '9:00 – 18:00',
  hours_thu: '9:00 – 18:00',
  hours_fri: '9:00 – 18:00',
  hours_sat: '9:00 – 15:00',
  hours_sun: 'Closed',
}

const HOURS_DAYS = [
  { key: 'hours_mon', labelKey: 'monday' },
  { key: 'hours_tue', labelKey: 'tuesday' },
  { key: 'hours_wed', labelKey: 'wednesday' },
  { key: 'hours_thu', labelKey: 'thursday' },
  { key: 'hours_fri', labelKey: 'friday' },
  { key: 'hours_sat', labelKey: 'saturday' },
  { key: 'hours_sun', labelKey: 'sunday' },
]

const MAX_BYTES = 50 * 1024 * 1024

async function uploadToCloudinary(file) {
  const sigRes = await fetch('/api/sign-upload?folder=tm-beauty/consultations')
  if (!sigRes.ok) throw new Error('Could not get upload signature')
  const { signature, timestamp, api_key, cloud_name } = await sigRes.json()

  const body = new FormData()
  body.append('file', file)
  body.append('signature', signature)
  body.append('timestamp', timestamp)
  body.append('api_key', api_key)
  body.append('folder', 'tm-beauty/consultations')

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, {
    method: 'POST',
    body,
  })
  if (!uploadRes.ok) throw new Error('Upload failed')
  const data = await uploadRes.json()
  return data.secure_url
}

export default function Contato() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' })
  const [file, setFile] = useState(null)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [contact, setContact] = useState(FALLBACK)

  useEffect(() => {
    fetch('/api/contact')
      .then(r => r.json())
      .then(d => {
        if (!d || d.error) return
        const weekday = d.hours_mon_fri || FALLBACK.hours_mon
        setContact({
          ...FALLBACK,
          ...d,
          hours_mon: d.hours_mon || weekday,
          hours_tue: d.hours_tue || weekday,
          hours_wed: d.hours_wed || weekday,
          hours_thu: d.hours_thu || weekday,
          hours_fri: d.hours_fri || weekday,
          hours_sat: d.hours_sat || FALLBACK.hours_sat,
          hours_sun: d.hours_sun || FALLBACK.hours_sun,
        })
      })
      .catch(() => {})
  }, [])

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0] || null
    setSubmitError('')
    if (picked && picked.size > MAX_BYTES) {
      setFile(null)
      setSubmitError(t('contato', 'uploadError'))
      e.target.value = ''
      return
    }
    setFile(picked)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    try {
      let photo_url = null
      if (file) {
        try {
          photo_url = await uploadToCloudinary(file)
        } catch {
          setSubmitError(t('contato', 'uploadError'))
          setSubmitting(false)
          return
        }
      }

      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          contact: form.email.trim(),
          service: form.service || null,
          notes: form.message.trim(),
          photo_url,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t('contato', 'submitError'))
      setSent(true)
    } catch (err) {
      setSubmitError(err.message || t('contato', 'submitError'))
    } finally {
      setSubmitting(false)
    }
  }

  const serviceOptions = [
    'Brazilian Nanoplastia',
    t('servicos', 'botox')?.name || 'Brazilian Botox',
    t('servicos', 'deep')?.name || 'Deep Treatment',
  ]

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('contato', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('contato', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('contato', 'subtitle')}</p>
        </div>
      </section>

      <section className={s.contactSection}>
        <div className={s.inner}>
          <div className={s.contactGrid}>
            <div className={s.infoCol}>
              <div className={s.infoBlock}>
                <h3 className={s.infoTitle}>{t('contato', 'location')}</h3>
                <p className={s.infoText}>{contact.address}</p>
              </div>

              <div className={s.infoBlock}>
                <h3 className={s.infoTitle}>{t('contato', 'directContact')}</h3>
                <div className={s.contactLinks}>
                  <a href={`tel:${contact.phone}`} className={s.contactLink}>
                    <span className={s.contactLinkIcon}><IconPhone size={18} /></span>
                    <span>{contact.phone}</span>
                  </a>
                  <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className={s.contactLink}>
                    <span className={s.contactLinkIcon}><IconWhatsApp size={18} /></span>
                    <span>WhatsApp</span>
                  </a>
                  <a href={`mailto:${contact.email}`} className={s.contactLink}>
                    <span className={s.contactLinkIcon}><IconMail size={18} /></span>
                    <span>{contact.email}</span>
                  </a>
                  <a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer" className={s.contactLink}>
                    <span className={s.contactLinkIcon}><IconInstagram size={18} /></span>
                    <span>@{contact.instagram}</span>
                  </a>
                </div>
              </div>

              <div className={s.infoBlock}>
                <h3 className={s.infoTitle}>{t('contato', 'hours')}</h3>
                <div className={s.hours}>
                  {HOURS_DAYS.map(day => (
                    <div key={day.key} className={s.hoursRow}>
                      <span>{t('contato', day.labelKey)}</span>
                      <span>{contact[day.key]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={s.mapEmbed}>
                <iframe
                  src={contact.map_url || FALLBACK.map_url}
                  width="100%"
                  height="260"
                  style={{ border: 0, borderRadius: 6 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="TM Beauty Studio location"
                />
              </div>
            </div>

            <div className={s.formCol}>
              <h2 className={s.formTitle}>{t('contato', 'formTitle')}</h2>
              <p className={s.formSub}>{t('contato', 'formSub')}</p>

              {sent ? (
                <div className={s.successMsg}>
                  <span className={s.successIcon}>✓</span>
                  <h3>{t('contato', 'successTitle')}</h3>
                  <p>{t('contato', 'successText')}</p>
                </div>
              ) : (
                <form className={s.form} onSubmit={handleSubmit}>
                  <div className={s.field}>
                    <label className={s.label}>{t('contato', 'name')}</label>
                    <input type="text" required className={s.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t('contato', 'namePlaceholder')} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>{t('contato', 'email')}</label>
                    <input type="email" required className={s.input} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder={t('contato', 'emailPlaceholder')} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>{t('contato', 'service')}</label>
                    <select className={s.input} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                      <option value="">{t('contato', 'servicePlaceholder')}</option>
                      {serviceOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>{t('contato', 'message')}</label>
                    <textarea required rows={5} className={s.textarea} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder={t('contato', 'messagePlaceholder')} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>{t('contato', 'mediaLabel')}</label>
                    <label className={`${s.uploadArea} ${file ? s.uploadDone : ''}`}>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className={s.fileInput}
                        onChange={handleFileChange}
                      />
                      {file ? (
                        <span className={s.uploadFileName}>{file.name}</span>
                      ) : (
                        <>
                          <IconUpload size={28} />
                          <span className={s.uploadHint}>{t('contato', 'mediaHint')}</span>
                          <span className={s.uploadTypes}>{t('contato', 'mediaTypes')}</span>
                        </>
                      )}
                    </label>
                  </div>
                  {submitError && <p className={s.formError}>{submitError}</p>}
                  <button type="submit" className={s.submitBtn} disabled={submitting}>
                    {submitting ? t('contato', 'sending') : t('contato', 'send')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
