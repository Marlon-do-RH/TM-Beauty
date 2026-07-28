import { useState, useEffect } from 'react'
import styles from './Admin.module.css'
import c from './Consultations.module.css'
import { IconTrash, IconMail, IconCheck, IconEye, IconImage } from '../../components/AdminIcons'

const STATUS_MAP = {
  new: { label: 'New', bg: '#FEF3E2', color: '#C0862E' },
  reviewed: { label: 'Reviewed', bg: '#EAF3FF', color: '#2563EB' },
  done: { label: 'Done', bg: '#EAF5EF', color: '#287A5B' },
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function Consultations() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const load = () => {
    setLoading(true)
    fetch('/api/consultations')
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false) })
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

  const filtered = items.filter(item => filter === 'all' || item.status === filter)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Consultations</h1>
          <p className={styles.pageSubtitle}>
            {loading ? 'Loading...' : `${items.length} request${items.length !== 1 ? 's' : ''} from the Contact form`}
          </p>
        </div>
      </div>

      <div className={c.filters}>
        {[
          { id: 'all', label: 'All' },
          { id: 'new', label: 'New' },
          { id: 'reviewed', label: 'Reviewed' },
          { id: 'done', label: 'Done' },
        ].map(f => (
          <button
            key={f.id}
            type="button"
            className={`${c.filterBtn} ${filter === f.id ? c.filterActive : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.pageSubtitle}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div className={c.empty}>
          <IconMail size={28} />
          <p>No consultation requests yet.</p>
        </div>
      ) : (
        <div className={c.layout}>
          <div className={c.list}>
            {filtered.map(item => {
              const st = STATUS_MAP[item.status] || STATUS_MAP.new
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${c.card} ${selected?.id === item.id ? c.cardActive : ''}`}
                  onClick={() => setSelected(item)}
                >
                  <div className={c.cardTop}>
                    <span className={c.cardName}>{item.name || 'Untitled'}</span>
                    <span className={c.badge} style={{ background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                  <div className={c.cardMeta}>{item.contact}</div>
                  <div className={c.cardMeta}>{item.service || 'No service'} · {formatDate(item.created_at)}</div>
                </button>
              )
            })}
          </div>

          <div className={c.detail}>
            {selected ? (
              <>
                <div className={c.detailHeader}>
                  <div>
                    <h2 className={c.detailTitle}>{selected.name}</h2>
                    <p className={c.detailSub}>{formatDate(selected.created_at)}</p>
                  </div>
                  <span
                    className={c.badge}
                    style={{
                      background: (STATUS_MAP[selected.status] || STATUS_MAP.new).bg,
                      color: (STATUS_MAP[selected.status] || STATUS_MAP.new).color,
                    }}
                  >
                    {(STATUS_MAP[selected.status] || STATUS_MAP.new).label}
                  </span>
                </div>

                <dl className={c.fields}>
                  <div><dt>Contact</dt><dd>{selected.contact || '—'}</dd></div>
                  <div><dt>Service</dt><dd>{selected.service || '—'}</dd></div>
                  <div><dt>Notes</dt><dd className={c.notes}>{selected.notes || '—'}</dd></div>
                  <div>
                    <dt>Media</dt>
                    <dd>
                      {selected.photo_url ? (
                        <a href={selected.photo_url} target="_blank" rel="noreferrer" className={c.mediaLink}>
                          <IconImage size={14} /> View photo / video
                        </a>
                      ) : 'None'}
                    </dd>
                  </div>
                </dl>

                <div className={c.actions}>
                  {selected.status === 'new' && (
                    <button type="button" className={c.actionBtn} onClick={() => setStatus(selected.id, 'reviewed')}>
                      <IconEye size={14} /> Mark reviewed
                    </button>
                  )}
                  {selected.status !== 'done' && (
                    <button type="button" className={c.actionBtn} onClick={() => setStatus(selected.id, 'done')}>
                      <IconCheck size={14} /> Mark done
                    </button>
                  )}
                  <button type="button" className={c.deleteBtn} onClick={() => remove(selected.id)}>
                    <IconTrash size={14} /> Delete
                  </button>
                </div>
              </>
            ) : (
              <div className={c.detailEmpty}>
                <p>Select a request to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
