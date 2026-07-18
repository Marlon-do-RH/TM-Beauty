import { useState } from 'react'
import styles from './Admin.module.css'
import a from './Appointments.module.css'
import { IconEdit, IconTrash, IconX, IconCheck, IconCalendar, IconSearch } from '../../components/AdminIcons'

const SERVICES = ['Brazilian Nanoplastia', 'Brazilian Botox', 'Deep Treatment']

const INITIAL = [
  { id: 1, name: 'Sarah M.', email: 'sarah@email.com', phone: '+61 400 111 111', service: 'Brazilian Nanoplastia', date: '2024-06-03', time: '10:00', status: 'confirmed', notes: '' },
  { id: 2, name: 'Camila R.', email: 'camila@email.com', phone: '+61 400 222 222', service: 'Brazilian Botox', date: '2024-06-03', time: '13:30', status: 'pending', notes: 'First time client' },
  { id: 3, name: 'Jessica T.', email: 'jess@email.com', phone: '+61 400 333 333', service: 'Deep Treatment', date: '2024-06-04', time: '11:00', status: 'confirmed', notes: '' },
  { id: 4, name: 'Ana P.', email: 'ana@email.com', phone: '+61 400 444 444', service: 'Brazilian Nanoplastia', date: '2024-06-05', time: '09:30', status: 'pending', notes: 'Allergic to strong fragrances' },
  { id: 5, name: 'Michelle K.', email: 'michelle@email.com', phone: '+61 400 555 555', service: 'Brazilian Botox', date: '2024-06-06', time: '14:00', status: 'completed', notes: '' },
]

const STATUS_MAP = {
  pending:   { label: 'Pendente',   bg: '#FEF3E2', color: '#C0862E' },
  confirmed: { label: 'Confirmado', bg: '#EAF5EF', color: '#287A5B' },
  completed: { label: 'Concluído',  bg: '#EAF3FF', color: '#2563EB' },
  cancelled: { label: 'Cancelado',  bg: '#FEF2F2', color: '#C0392B' },
}

const EMPTY = { name: '', email: '', phone: '', service: SERVICES[0], date: '', time: '', status: 'pending', notes: '' }

function Modal({ title, onClose, children }) {
  return (
    <div className={a.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={a.modal}>
        <div className={a.modalHeader}>
          <h2 className={a.modalTitle}>{title}</h2>
          <button className={a.modalClose} onClick={onClose} aria-label="Fechar">
            <IconX size={14} />
          </button>
        </div>
        <div className={a.modalBody}>{children}</div>
      </div>
    </div>
  )
}

function BookingForm({ initial, onSave, onCancel, mode }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }}>
      <div className={a.formGrid}>
        <div className={styles.field}>
          <label className={styles.label}>Nome da cliente *</label>
          <input required className={styles.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nome completo" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>E-mail</label>
          <input type="email" className={styles.input} value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@exemplo.com" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Telefone</label>
          <input className={styles.input} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+61 400 000 000" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Serviço *</label>
          <select required className={styles.select} value={form.service} onChange={e => set('service', e.target.value)}>
            {SERVICES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Data *</label>
          <input type="date" required className={styles.input} value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Horário *</label>
          <input type="time" required className={styles.input} value={form.time} onChange={e => set('time', e.target.value)} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select className={styles.select} value={form.status} onChange={e => set('status', e.target.value)}>
            {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.label}>Observações</label>
          <textarea rows={3} className={styles.textarea} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Alergias, preferências, primeira vez..." />
        </div>
      </div>
      <div className={a.formActions}>
        <button type="button" className={a.cancelBtn} onClick={onCancel}>Cancelar</button>
        <button type="submit" className={styles.submitBtn}>
          <IconCheck size={14} />
          {mode === 'create' ? 'Criar Agendamento' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  )
}

function DeleteConfirm({ booking, onConfirm, onCancel }) {
  return (
    <div className={a.deleteConfirm}>
      <div className={a.deleteIconWrap}>
        <IconTrash size={22} />
      </div>
      <p className={a.deleteText}>
        Tem certeza que deseja excluir o agendamento de <strong>{booking.name}</strong> ({booking.service} — {booking.date} às {booking.time})?
      </p>
      <p className={a.deleteHint}>Esta ação não pode ser desfeita.</p>
      <div className={a.formActions}>
        <button className={a.cancelBtn} onClick={onCancel}>Cancelar</button>
        <button className={a.deleteBtn} onClick={onConfirm}>
          <IconTrash size={13} />
          Excluir Permanentemente
        </button>
      </div>
    </div>
  )
}

export default function Appointments() {
  const [appts, setAppts] = useState(INITIAL)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = appts.filter(a => {
    const matchFilter = filter === 'all' || a.status === filter
    const matchSearch = !search || [a.name, a.email, a.service].some(v => v.toLowerCase().includes(search.toLowerCase()))
    return matchFilter && matchSearch
  })

  const handleCreate = form => {
    setAppts(prev => [...prev, { ...form, id: Date.now() }])
    setModal(null)
  }

  const handleEdit = form => {
    setAppts(prev => prev.map(x => x.id === form.id ? form : x))
    setModal(null)
  }

  const handleDelete = id => {
    setAppts(prev => prev.filter(x => x.id !== id))
    setModal(null)
  }

  const quickStatus = (id, status) => {
    setAppts(prev => prev.map(x => x.id === id ? { ...x, status } : x))
  }

  const countByStatus = st => appts.filter(a => a.status === st).length

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Agendamentos</h1>
          <p className={styles.pageSubtitle}>{appts.length} agendamento(s) no total</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setModal({ mode: 'create', booking: EMPTY })}>
          Novo Agendamento
        </button>
      </div>

      <div className={a.summaryCards}>
        {Object.entries(STATUS_MAP).map(([k, v]) => (
          <div key={k} className={a.summaryCard} style={{ borderLeftColor: v.color }}>
            <span className={a.summaryNum} style={{ color: v.color }}>{countByStatus(k)}</span>
            <span className={a.summaryLabel}>{v.label}</span>
          </div>
        ))}
      </div>

      <div className={a.toolBar}>
        <div className={styles.filterRow}>
          <button className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`} onClick={() => setFilter('all')}>Todos</button>
          {Object.entries(STATUS_MAP).map(([k, v]) => (
            <button key={k} className={`${styles.filterBtn} ${filter === k ? styles.filterBtnActive : ''}`} onClick={() => setFilter(k)}>
              {v.label}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: 12, color: 'var(--text-muted)', display: 'flex' }}>
            <IconSearch size={14} />
          </span>
          <input
            className={`${styles.input} ${a.searchInput}`}
            style={{ paddingLeft: 36 }}
            placeholder="Buscar por nome, e-mail ou serviço..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}><IconCalendar size={32} /></div>
            <p>Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ap => {
                const st = STATUS_MAP[ap.status]
                return (
                  <tr key={ap.id}>
                    <td>
                      <div className={styles.tdName}>{ap.name}</div>
                      {ap.phone && <div className={a.tdSub}>{ap.phone}</div>}
                    </td>
                    <td>{ap.service}</td>
                    <td>{ap.date}</td>
                    <td>{ap.time}</td>
                    <td>
                      <span className={styles.badge} style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        {ap.status === 'pending' && (
                          <button className={styles.actionBtn} onClick={() => quickStatus(ap.id, 'confirmed')}>
                            <IconCheck size={12} /> Confirmar
                          </button>
                        )}
                        {ap.status === 'confirmed' && (
                          <button className={styles.actionBtn} onClick={() => quickStatus(ap.id, 'completed')}>
                            <IconCheck size={12} /> Concluir
                          </button>
                        )}
                        <button className={styles.actionBtn} onClick={() => setModal({ mode: 'edit', booking: { ...ap } })} title="Editar">
                          <IconEdit size={13} />
                        </button>
                        <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => setModal({ mode: 'delete', booking: ap })} title="Excluir">
                          <IconTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal?.mode === 'create' && (
        <Modal title="Novo Agendamento" onClose={() => setModal(null)}>
          <BookingForm initial={modal.booking} onSave={handleCreate} onCancel={() => setModal(null)} mode="create" />
        </Modal>
      )}

      {modal?.mode === 'edit' && (
        <Modal title="Editar Agendamento" onClose={() => setModal(null)}>
          <BookingForm initial={modal.booking} onSave={handleEdit} onCancel={() => setModal(null)} mode="edit" />
        </Modal>
      )}

      {modal?.mode === 'delete' && (
        <Modal title="Excluir Agendamento" onClose={() => setModal(null)}>
          <DeleteConfirm
            booking={modal.booking}
            onConfirm={() => handleDelete(modal.booking.id)}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}
