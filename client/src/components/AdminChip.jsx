import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconCheck, IconEye, IconImage, IconLogOut, IconMail, IconTrash } from './AdminIcons'
import styles from './AdminChip.module.css'

const STATUS_MAP = {
  new: { label: 'New', bg: '#FEF3E2', color: '#C0862E' },
  reviewed: { label: 'Reviewed', bg: '#EAF3FF', color: '#2563EB' },
  done: { label: 'Done', bg: '#EAF5EF', color: '#287A5B' },
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('en-AU', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function AdminChip({ onLogout, onClose }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const load = () => {
    setLoading(true)
    fetch('/api/consultations')
      .then(r => r.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const setStatus = async (id, status) => {
    const res = await fetch(`/api/consultations?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (res.ok) {
      setItems(list => list.map(x => x.id === id ? data : x))
      setSelected(s => (s && s.id === id ? data : s))
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this consultation request?')) return
    await fetch(`/api/consultations?id=${id}`, { method: 'DELETE' })
    setItems(list => list.filter(x => x.id !== id))
    setSelected(s => (s && s.id === id ? null : s))
  }

  const newCount = items.filter(i => i.status === 'new').length

  return (
    <div className={styles.panel} role="dialog" aria-label="Admin panel">
      <div className={styles.head}>
        <div>
          <p className={styles.kicker}>Signed in</p>
          <p className={styles.title}>Edit this page</p>
        </div>
        <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="Close panel">×</button>
      </div>
      <p className={styles.hint}>Gold pencils appear on photos and Before &amp; After cards.</p>

      <div className={styles.actions}>
        <Link to="/admin" className={styles.more} onClick={onClose}>More settings</Link>
        <button type="button" className={styles.logout} onClick={onLogout}>
          <IconLogOut size={13} /> Log out
        </button>
      </div>

      <div className={styles.inboxHead}>
        <IconMail size={14} />
        <span>Consultations</span>
        {newCount > 0 && <span className={styles.badge}>{newCount} new</span>}
      </div>

      {loading ? (
        <p className={styles.empty}>Loading…</p>
      ) : items.length === 0 ? (
        <p className={styles.empty}>No consultation requests yet.</p>
      ) : (
        <div className={styles.inbox}>
          <div className={styles.list}>
            {items.slice(0, 8).map(item => {
              const st = STATUS_MAP[item.status] || STATUS_MAP.new
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.card} ${selected?.id === item.id ? styles.cardActive : ''}`}
                  onClick={() => setSelected(item)}
                >
                  <span className={styles.cardName}>{item.name || 'Untitled'}</span>
                  <span className={styles.status} style={{ background: st.bg, color: st.color }}>{st.label}</span>
                </button>
              )
            })}
          </div>
          {selected && (
            <div className={styles.detail}>
              <p className={styles.detailName}>{selected.name}</p>
              <p className={styles.meta}>{selected.contact || '—'} · {formatDate(selected.created_at)}</p>
              <p className={styles.meta}>{selected.service || 'No service'}</p>
              {selected.notes && <p className={styles.notes}>{selected.notes}</p>}
              {selected.photo_url && (
                <a href={selected.photo_url} target="_blank" rel="noreferrer" className={styles.media}>
                  <IconImage size={13} /> View media
                </a>
              )}
              <div className={styles.detailActions}>
                {selected.status === 'new' && (
                  <button type="button" onClick={() => setStatus(selected.id, 'reviewed')}>
                    <IconEye size={12} /> Reviewed
                  </button>
                )}
                {selected.status !== 'done' && (
                  <button type="button" onClick={() => setStatus(selected.id, 'done')}>
                    <IconCheck size={12} /> Done
                  </button>
                )}
                <button type="button" className={styles.danger} onClick={() => remove(selected.id)}>
                  <IconTrash size={12} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
