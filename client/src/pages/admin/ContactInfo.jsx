import { useState, useEffect } from 'react'
import styles from './Admin.module.css'
import ci from './ContactInfo.module.css'
import { IconPhone, IconMail, IconInstagram, IconWhatsApp, IconMapPin, IconClock, IconEye, IconCheck } from '../../components/AdminIcons'

const HOURS_FIELDS = [
  { key: 'hours_mon', label: 'Monday', placeholder: '9:00 – 18:00' },
  { key: 'hours_tue', label: 'Tuesday', placeholder: '9:00 – 18:00' },
  { key: 'hours_wed', label: 'Wednesday', placeholder: '9:00 – 18:00' },
  { key: 'hours_thu', label: 'Thursday', placeholder: '9:00 – 18:00' },
  { key: 'hours_fri', label: 'Friday', placeholder: '9:00 – 18:00' },
  { key: 'hours_sat', label: 'Saturday', placeholder: '9:00 – 15:00' },
  { key: 'hours_sun', label: 'Sunday', placeholder: 'Closed' },
]

const INITIAL = {
  phone: '+61 450 442 869', whatsapp: '61450442869',
  email: 'hello@thalitamedeiros.com.au', instagram: 'thalita.medeiros.hair',
  address: '100 Wells St, Southbank VIC 3006', map_url: '',
  hours_mon: '9:00 – 18:00',
  hours_tue: '9:00 – 18:00',
  hours_wed: '9:00 – 18:00',
  hours_thu: '9:00 – 18:00',
  hours_fri: '9:00 – 18:00',
  hours_sat: '9:00 – 15:00',
  hours_sun: 'Closed',
  booking_note: 'Book via WhatsApp or fill in the contact form.',
}

function normalizeContact(d) {
  if (!d || d.error) return null
  const weekday = d.hours_mon_fri || INITIAL.hours_mon
  return {
    ...INITIAL,
    ...d,
    hours_mon: d.hours_mon || weekday,
    hours_tue: d.hours_tue || weekday,
    hours_wed: d.hours_wed || weekday,
    hours_thu: d.hours_thu || weekday,
    hours_fri: d.hours_fri || weekday,
    hours_sat: d.hours_sat || INITIAL.hours_sat,
    hours_sun: d.hours_sun || INITIAL.hours_sun,
  }
}

export default function ContactInfo() {
  const [data, setData] = useState(INITIAL)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/contact')
      .then(r => r.json())
      .then(d => {
        const next = normalizeContact(d)
        if (next) setData(next)
      })
      .catch(() => {})
  }, [])

  const set = (key, val) => {
    setData(d => ({ ...d, [key]: val }))
    setSaved(false)
  }

  const handleSave = async e => {
    e.preventDefault()
    const { hours_mon_fri, ...payload } = data
    await fetch('/api/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Contact Information</h1>
          <p className={styles.pageSubtitle}>This information appears on the Contact page and site footer</p>
        </div>
        {saved && (
          <div className={ci.savedBadge}>
            <IconCheck size={13} /> Saved successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className={ci.formGrid}>

        <section className={ci.section}>
          <h2 className={ci.sectionTitle}>
            <IconPhone size={16} /> Direct Contact
          </h2>
          <div className={ci.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Phone / WhatsApp (display)</label>
              <input className={styles.input} value={data.phone} onChange={e => set('phone', e.target.value)} placeholder="+61 400 000 000" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>WhatsApp number (digits only, with country code)</label>
              <div className={ci.inputPrefix}>
                <span className={ci.prefix}>wa.me/</span>
                <input className={`${styles.input} ${ci.inputPrefixInput}`} value={data.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="61400000000" />
              </div>
              <p className={ci.hint}>Used for the &ldquo;Book via WhatsApp&rdquo; button</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input type="email" className={styles.input} value={data.email} onChange={e => set('email', e.target.value)} placeholder="hello@yourdomain.com.au" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Instagram (without @)</label>
              <div className={ci.inputPrefix}>
                <span className={ci.prefix}>@</span>
                <input className={`${styles.input} ${ci.inputPrefixInput}`} value={data.instagram} onChange={e => set('instagram', e.target.value)} placeholder="thalita.medeiros.hair" />
              </div>
            </div>
          </div>
        </section>

        <section className={ci.section}>
          <h2 className={ci.sectionTitle}>
            <IconMapPin size={16} /> Address
          </h2>
          <div className={ci.fields}>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Full address</label>
              <input className={styles.input} value={data.address} onChange={e => set('address', e.target.value)} placeholder="Street, number, suburb, Melbourne, VIC" />
            </div>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Google Maps Embed URL</label>
              <input className={styles.input} value={data.map_url || ''} onChange={e => set('map_url', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
              <p className={ci.hint}>
                In Google Maps: Share → Embed a map → copy the src=&ldquo;...&rdquo; from the iframe
              </p>
            </div>
            {data.map_url && (
              <div className={ci.mapPreview} style={{ gridColumn: '1 / -1' }}>
                <p className={ci.previewLabel}>Map preview</p>
                <iframe
                  src={data.map_url}
                  width="100%"
                  height="280"
                  style={{ border: 0, borderRadius: 6 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Map preview"
                />
              </div>
            )}
          </div>
        </section>

        <section className={ci.section}>
          <h2 className={ci.sectionTitle}>
            <IconClock size={16} /> Opening Hours
          </h2>
          <div className={ci.fields}>
            {HOURS_FIELDS.map(day => (
              <div key={day.key} className={styles.field}>
                <label className={styles.label}>{day.label}</label>
                <input
                  className={styles.input}
                  value={data[day.key] || ''}
                  onChange={e => set(day.key, e.target.value)}
                  placeholder={day.placeholder}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={ci.section}>
          <h2 className={ci.sectionTitle}>Booking Note</h2>
          <div className={ci.fields}>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Message shown on the contact page</label>
              <textarea
                rows={3}
                className={styles.textarea}
                value={data.booking_note || ''}
                onChange={e => set('booking_note', e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className={ci.section}>
          <h2 className={ci.sectionTitle}>
            <IconEye size={16} /> Preview
          </h2>
          <div className={ci.preview}>
            <div className={ci.previewRow}><IconPhone size={14} className={ci.previewIconSvg} /><span>{data.phone}</span></div>
            <div className={ci.previewRow}><IconWhatsApp size={14} className={ci.previewIconSvg} /><span>wa.me/{data.whatsapp}</span></div>
            <div className={ci.previewRow}><IconMail size={14} className={ci.previewIconSvg} /><span>{data.email}</span></div>
            <div className={ci.previewRow}><IconInstagram size={14} className={ci.previewIconSvg} /><span>@{data.instagram}</span></div>
            <div className={ci.previewRow}><IconMapPin size={14} className={ci.previewIconSvg} /><span>{data.address}</span></div>
            <div className={ci.previewRow} style={{ alignItems: 'flex-start' }}>
              <IconClock size={14} className={ci.previewIconSvg} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {HOURS_FIELDS.map(day => (
                  <span key={day.key}>{day.label}: {data[day.key] || '—'}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className={ci.saveRow}>
          <button type="submit" className={styles.submitBtn}>
            <IconCheck size={14} />
            Save Contact Information
          </button>
        </div>
      </form>
    </div>
  )
}
