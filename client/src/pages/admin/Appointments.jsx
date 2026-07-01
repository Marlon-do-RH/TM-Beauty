import { useState } from 'react'
import styles from './Admin.module.css'

const INITIAL = [
  { id: 1, name: 'Sarah M.', email: 'sarah@email.com', service: 'Brazilian Nanoplastia', date: '2024-06-03', time: '10:00', status: 'confirmed' },
  { id: 2, name: 'Camila R.', email: 'camila@email.com', service: 'Brazilian Botox', date: '2024-06-03', time: '13:30', status: 'pending' },
  { id: 3, name: 'Jessica T.', email: 'jess@email.com', service: 'Deep Treatment', date: '2024-06-04', time: '11:00', status: 'confirmed' },
  { id: 4, name: 'Ana P.', email: 'ana@email.com', service: 'Brazilian Nanoplastia', date: '2024-06-05', time: '09:30', status: 'pending' },
  { id: 5, name: 'Michelle K.', email: 'michelle@email.com', service: 'Brazilian Botox', date: '2024-06-06', time: '14:00', status: 'completed' },
]

const statusColors = {
  pending: { bg: 'rgba(230,126,34,0.12)', color: '#e67e22', label: 'Pendente' },
  confirmed: { bg: 'rgba(39,174,96,0.12)', color: '#27ae60', label: 'Confirmado' },
  completed: { bg: 'rgba(52,152,219,0.12)', color: '#3498db', label: 'Concluído' },
  cancelled: { bg: 'rgba(231,76,60,0.12)', color: '#e74c3c', label: 'Cancelado' },
}

const EMPTY_FORM = { name: '', email: '', service: 'Brazilian Nanoplastia', date: '', time: '', status: 'pending' }

export default function Appointments() {
  const [appts, setAppts] = useState(INITIAL)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filter, setFilter] = useState('all')

  const handleAdd = e => {
    e.preventDefault()
    setAppts(a => [...a, { ...form, id: Date.now() }])
    setForm(EMPTY_FORM)
  }

  const setStatus = (id, status) => {
    setAppts(a => a.map(x => x.id === id ? { ...x, status } : x))
  }

  const remove = id => setAppts(a => a.filter(x => x.id !== id))

  const filtered = filter === 'all' ? appts : appts.filter(a => a.status === filter)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Agendamentos</h1>
          <p className={styles.pageSubtitle}>{appts.length} agendamento(s) no total</p>
        </div>
      </div>

      {/* Add form */}
      <div className={styles.form}>
        <p className={styles.formTitle}>+ Novo Agendamento</p>
        <form onSubmit={handleAdd}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Nome</label>
              <input required className={styles.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome da cliente" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>E-mail</label>
              <input type="email" className={styles.input} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Serviço</label>
              <select className={styles.select} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                <option>Brazilian Nanoplastia</option>
                <option>Brazilian Botox</option>
                <option>Deep Treatment</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Data</label>
              <input type="date" required className={styles.input} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Horário</label>
              <input type="time" required className={styles.input} value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn}>Adicionar</button>
        </form>
      </div>

      {/* Filter */}
      <div className={styles.filterRow}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Todos' : statusColors[f]?.label || f}
          </button>
        ))}
      </div>

      <div className={styles.tableWrapper}>
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
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#444' }}>Nenhum agendamento encontrado.</td></tr>
            ) : filtered.map(a => {
              const st = statusColors[a.status] || statusColors.pending
              return (
                <tr key={a.id}>
                  <td className={styles.tdName}>{a.name}</td>
                  <td>{a.service}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>
                    <span className={styles.badge} style={{ background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      {a.status === 'pending' && (
                        <button className={styles.actionBtn} onClick={() => setStatus(a.id, 'confirmed')}>Confirmar</button>
                      )}
                      {a.status === 'confirmed' && (
                        <button className={styles.actionBtn} onClick={() => setStatus(a.id, 'completed')}>Concluir</button>
                      )}
                      {a.status !== 'cancelled' && (
                        <button className={styles.actionBtn} onClick={() => setStatus(a.id, 'cancelled')}>Cancelar</button>
                      )}
                      <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => remove(a.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
