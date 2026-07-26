import { useState, useEffect } from 'react'
import styles from './Admin.module.css'
import ci from './ContactInfo.module.css'
import { IconPhone, IconMail, IconInstagram, IconWhatsApp, IconMapPin, IconClock, IconEye, IconCheck } from '../../components/AdminIcons'

const INITIAL = {
  phone: '+61 450 442 869', whatsapp: '61450442869',
  email: 'hello@thalitamedeiros.com.au', instagram: 'thalita.medeiros.hair',
  address: '100 Wells St, Southbank VIC 3006', map_url: '',
  hours_mon_fri: '9:00 – 18:00', hours_sat: '9:00 – 15:00', hours_sun: 'Closed',
  booking_note: 'Book via WhatsApp or fill in the contact form.',
}

export default function ContactInfo() {
  const [data, setData] = useState(INITIAL)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/contact')
      .then(r => r.json())
      .then(d => d && !d.error && setData(d))
      .catch(() => {})
  }, [])

  const set = (key, val) => {
    setData(d => ({ ...d, [key]: val }))
    setSaved(false)
  }

  const handleSave = async e => {
    e.preventDefault()
    await fetch('/api/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Informações de Contato</h1>
          <p className={styles.pageSubtitle}>Estas informações aparecem na página de Contato e rodapé do site</p>
        </div>
        {saved && (
          <div className={ci.savedBadge}>
            <IconCheck size={13} /> Salvo com sucesso
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className={ci.formGrid}>

        <section className={ci.section}>
          <h2 className={ci.sectionTitle}>
            <IconPhone size={16} /> Contato Direto
          </h2>
          <div className={ci.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Telefone / WhatsApp (exibição)</label>
              <input className={styles.input} value={data.phone} onChange={e => set('phone', e.target.value)} placeholder="+61 400 000 000" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Número WhatsApp (somente dígitos, com DDI)</label>
              <div className={ci.inputPrefix}>
                <span className={ci.prefix}>wa.me/</span>
                <input className={`${styles.input} ${ci.inputPrefixInput}`} value={data.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="61400000000" />
              </div>
              <p className={ci.hint}>Usado para o botão &ldquo;Agendar pelo WhatsApp&rdquo;</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>E-mail</label>
              <input type="email" className={styles.input} value={data.email} onChange={e => set('email', e.target.value)} placeholder="hello@seudominio.com.au" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Instagram (sem @)</label>
              <div className={ci.inputPrefix}>
                <span className={ci.prefix}>@</span>
                <input className={`${styles.input} ${ci.inputPrefixInput}`} value={data.instagram} onChange={e => set('instagram', e.target.value)} placeholder="thalita.medeiros.hair" />
              </div>
            </div>
          </div>
        </section>

        <section className={ci.section}>
          <h2 className={ci.sectionTitle}>
            <IconMapPin size={16} /> Endereço
          </h2>
          <div className={ci.fields}>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Endereço completo</label>
              <input className={styles.input} value={data.address} onChange={e => set('address', e.target.value)} placeholder="Rua, nº, Bairro, Melbourne, VIC" />
            </div>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Google Maps Embed URL</label>
              <input className={styles.input} value={data.map_url || ''} onChange={e => set('map_url', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
              <p className={ci.hint}>
                No Google Maps: Compartilhar → Incorporar mapa → copiar o src=&ldquo;...&rdquo; do iframe
              </p>
            </div>
            {data.map_url && (
              <div className={ci.mapPreview} style={{ gridColumn: '1 / -1' }}>
                <p className={ci.previewLabel}>Pré-visualização do mapa</p>
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
            <IconClock size={16} /> Horário de Atendimento
          </h2>
          <div className={ci.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Segunda — Sexta</label>
              <input className={styles.input} value={data.hours_mon_fri || ''} onChange={e => set('hours_mon_fri', e.target.value)} placeholder="9:00 – 18:00" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Sábado</label>
              <input className={styles.input} value={data.hours_sat || ''} onChange={e => set('hours_sat', e.target.value)} placeholder="9:00 – 15:00" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Domingo</label>
              <input className={styles.input} value={data.hours_sun || ''} onChange={e => set('hours_sun', e.target.value)} placeholder="Fechado" />
            </div>
          </div>
        </section>

        <section className={ci.section}>
          <h2 className={ci.sectionTitle}>Nota de Agendamento</h2>
          <div className={ci.fields}>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Mensagem exibida na página de contato</label>
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
            <IconEye size={16} /> Pré-visualização
          </h2>
          <div className={ci.preview}>
            <div className={ci.previewRow}><IconPhone size={14} className={ci.previewIconSvg} /><span>{data.phone}</span></div>
            <div className={ci.previewRow}><IconWhatsApp size={14} className={ci.previewIconSvg} /><span>wa.me/{data.whatsapp}</span></div>
            <div className={ci.previewRow}><IconMail size={14} className={ci.previewIconSvg} /><span>{data.email}</span></div>
            <div className={ci.previewRow}><IconInstagram size={14} className={ci.previewIconSvg} /><span>@{data.instagram}</span></div>
            <div className={ci.previewRow}><IconMapPin size={14} className={ci.previewIconSvg} /><span>{data.address}</span></div>
            <div className={ci.previewRow}>
              <IconClock size={14} className={ci.previewIconSvg} />
              <span>Seg–Sex: {data.hours_mon_fri} · Sáb: {data.hours_sat} · Dom: {data.hours_sun}</span>
            </div>
          </div>
        </section>

        <div className={ci.saveRow}>
          <button type="submit" className={styles.submitBtn}>
            <IconCheck size={14} />
            Salvar Informações de Contato
          </button>
        </div>
      </form>
    </div>
  )
}
