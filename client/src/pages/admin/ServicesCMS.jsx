import { useState } from 'react'
import styles from './Admin.module.css'

const INITIAL_SERVICES = [
  { id: 1, name: 'Brazilian Nanoplastia', description: 'Alisamento avançado sem formol com nanopartículas.', price: 280, duration: '3–4 horas' },
  { id: 2, name: 'Brazilian Botox', description: 'Hidratação profunda e redução de volume.', price: 220, duration: '2–3 horas' },
  { id: 3, name: 'Deep Treatment', description: 'Tratamento reconstrutivo intensivo.', price: 180, duration: '1–2 horas' },
]

export default function ServicesCMS() {
  const [services, setServices] = useState(INITIAL_SERVICES)
  const [editing, setEditing] = useState(null)
  const [editData, setEditData] = useState({})

  const startEdit = svc => {
    setEditing(svc.id)
    setEditData({ ...svc })
  }

  const saveEdit = id => {
    setServices(s => s.map(x => x.id === id ? { ...editData } : x))
    setEditing(null)
  }

  const cancelEdit = () => setEditing(null)

  const removeService = id => setServices(s => s.filter(x => x.id !== id))

  const [newForm, setNewForm] = useState({ name: '', description: '', price: '', duration: '' })

  const addService = e => {
    e.preventDefault()
    setServices(s => [...s, { ...newForm, price: Number(newForm.price), id: Date.now() }])
    setNewForm({ name: '', description: '', price: '', duration: '' })
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Serviços</h1>
          <p className={styles.pageSubtitle}>Gerencie os serviços exibidos no site</p>
        </div>
      </div>

      {/* Services list */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Serviço</th>
              <th>Descrição</th>
              <th>Preço (R$)</th>
              <th>Duração</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map(svc => (
              <tr key={svc.id}>
                {editing === svc.id ? (
                  <>
                    <td><input className={styles.editInput} value={editData.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} /></td>
                    <td><input className={styles.editInput} value={editData.description} onChange={e => setEditData(d => ({ ...d, description: e.target.value }))} /></td>
                    <td><input type="number" className={styles.editInput} style={{ width: 100 }} value={editData.price} onChange={e => setEditData(d => ({ ...d, price: e.target.value }))} /></td>
                    <td><input className={styles.editInput} value={editData.duration} onChange={e => setEditData(d => ({ ...d, duration: e.target.value }))} /></td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.actionBtn} onClick={() => saveEdit(svc.id)}>✓ Salvar</button>
                        <button className={styles.actionBtn} onClick={cancelEdit}>✕</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className={styles.tdName}>{svc.name}</td>
                    <td style={{ maxWidth: 300, fontSize: '0.82rem', color: '#888' }}>{svc.description}</td>
                    <td style={{ color: '#C9A84C', fontWeight: 700 }}>R$ {svc.price}</td>
                    <td>{svc.duration}</td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.actionBtn} onClick={() => startEdit(svc)}>✎ Editar</button>
                        <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => removeService(svc.id)}>✕</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add new */}
      <div className={styles.form}>
        <p className={styles.formTitle}>+ Adicionar Serviço</p>
        <form onSubmit={addService}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Nome do Serviço</label>
              <input required className={styles.input} value={newForm.name} onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Brazilian Nanoplastia" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Preço (R$)</label>
              <input required type="number" className={styles.input} value={newForm.price} onChange={e => setNewForm(f => ({ ...f, price: e.target.value }))} placeholder="280" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Duração</label>
              <input required className={styles.input} value={newForm.duration} onChange={e => setNewForm(f => ({ ...f, duration: e.target.value }))} placeholder="3–4 horas" />
            </div>
          </div>
          <div className={styles.field} style={{ marginTop: 16 }}>
            <label className={styles.label}>Descrição</label>
            <textarea className={styles.textarea} value={newForm.description} onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))} placeholder="Descreva o serviço..." />
          </div>
          <button type="submit" className={styles.submitBtn}>Adicionar Serviço</button>
        </form>
      </div>
    </div>
  )
}
