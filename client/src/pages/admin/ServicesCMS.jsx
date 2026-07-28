import { useState, useEffect } from 'react'
import styles from './Admin.module.css'
import sv from './ServicesCMS.module.css'
import { IconEdit, IconTrash, IconX, IconCheck } from '../../components/AdminIcons'

const EMPTY = { name: '', description: '', price: '', price_min: '', price_max: '', duration: '', duration_unit: 'hours', active: true }

// Normalize legacy Portuguese units to English for display/select; accept both when reading
const UNIT_LABELS = { hours: 'hours', minutes: 'minutes', horas: 'hours', minutos: 'minutes' }
const normalizeUnit = (u) => (u === 'horas' ? 'hours' : u === 'minutos' ? 'minutes' : (u || 'hours'))

function ServiceModal({ initial, onSave, onClose, mode }) {
  const [form, setForm] = useState({ ...initial, duration_unit: normalizeUnit(initial.duration_unit) })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className={sv.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={sv.modal}>
        <div className={sv.modalHeader}>
          <h2 className={sv.modalTitle}>{mode === 'create' ? 'New Service' : 'Edit Service'}</h2>
          <button className={sv.modalClose} onClick={onClose} aria-label="Close">
            <IconX size={14} />
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className={sv.modalBody}>
          <div className={sv.formGrid}>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Service Name *</label>
              <input required className={styles.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Brazilian Nanoplastia" />
            </div>

            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Description</label>
              <textarea rows={3} className={styles.textarea} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the service for clients..." />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>List price (R$) *</label>
              <input required type="number" min="0" className={styles.input} value={form.price_min || ''} onChange={e => set('price_min', e.target.value)} placeholder="280" />
              <p className={sv.hint}>Displayed as &ldquo;from&rdquo;</p>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Price range (optional)</label>
              <div className={sv.rangeRow}>
                <input type="number" min="0" className={styles.input} value={form.price_min || ''} onChange={e => set('price_min', e.target.value)} placeholder="Min" />
                <span className={sv.rangeSep}>–</span>
                <input type="number" min="0" className={styles.input} value={form.price_max || ''} onChange={e => set('price_max', e.target.value)} placeholder="Max" />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Duration *</label>
              <div className={sv.rangeRow}>
                <input required className={styles.input} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="1–2" />
                <select className={styles.select} value={form.duration_unit} onChange={e => set('duration_unit', e.target.value)}>
                  <option value="hours">hours</option>
                  <option value="minutes">minutes</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <div className={sv.toggleRow}>
                <button
                  type="button"
                  className={`${sv.toggleBtn} ${form.active ? sv.toggleBtnOn : ''}`}
                  onClick={() => set('active', !form.active)}
                >
                  {form.active ? 'Active' : 'Inactive'}
                </button>
                <p className={sv.hint}>Inactive services do not appear on the site</p>
              </div>
            </div>
          </div>

          <div className={sv.formActions}>
            <button type="button" className={sv.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>
              <IconCheck size={14} />
              {mode === 'create' ? 'Create Service' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ServicesCMS() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(data => { setServices(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async form => {
    const payload = {
      name: form.name, description: form.description,
      price_min: Number(form.price_min) || Number(form.price) || 0,
      price_max: Number(form.price_max) || 0,
      duration: form.duration, duration_unit: normalizeUnit(form.duration_unit),
      active: form.active,
    }
    if (modal.mode === 'create') {
      const res = await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      setServices(s => [...s, data])
    } else {
      const res = await fetch(`/api/services?id=${form.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      setServices(s => s.map(x => x.id === form.id ? data : x))
    }
    setModal(null)
  }

  const remove = async id => {
    await fetch(`/api/services?id=${id}`, { method: 'DELETE' })
    setServices(s => s.filter(x => x.id !== id))
  }

  const toggle = async id => {
    const svc = services.find(x => x.id === id)
    const res = await fetch(`/api/services?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !svc.active }) })
    const data = await res.json()
    setServices(s => s.map(x => x.id === id ? data : x))
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Services & Pricing</h1>
          <p className={styles.pageSubtitle}>{loading ? 'Loading...' : 'Manage the services, prices, and durations shown on the site'}</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setModal({ mode: 'create', svc: EMPTY })}>
          New Service
        </button>
      </div>

      <div className={sv.cards}>
        {services.map(svc => (
          <div key={svc.id} className={`${sv.card} ${!svc.active ? sv.cardInactive : ''}`}>
            <div className={sv.cardTop}>
              <div>
                <h3 className={sv.cardName}>{svc.name}</h3>
                <p className={sv.cardDesc}>{svc.description}</p>
              </div>
              <button
                className={`${sv.statusPill} ${svc.active ? sv.statusActive : sv.statusInactive}`}
                onClick={() => toggle(svc.id)}
                title="Click to toggle status"
              >
                {svc.active ? 'Active' : 'Inactive'}
              </button>
            </div>

            <div className={sv.cardMeta}>
              <div className={sv.metaItem}>
                <span className={sv.metaLabel}>Price</span>
                <span className={sv.metaValue}>
                  R$ {svc.price_min}
                  {svc.price_max > svc.price_min && <span className={sv.metaRange}> – R$ {svc.price_max}</span>}
                </span>
              </div>
              <div className={sv.metaItem}>
                <span className={sv.metaLabel}>Duration</span>
                <span className={sv.metaValue}>{svc.duration} {UNIT_LABELS[svc.duration_unit] || svc.duration_unit}</span>
              </div>
            </div>

            <div className={sv.cardActions}>
              <button className={styles.actionBtn} onClick={() => setModal({ mode: 'edit', svc: { ...svc } })}>
                <IconEdit size={13} /> Edit
              </button>
              <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => remove(svc.id)}>
                <IconTrash size={13} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <ServiceModal
          initial={modal.svc}
          mode={modal.mode}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
