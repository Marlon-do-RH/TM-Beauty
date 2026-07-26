import { useState, useEffect } from 'react'
import styles from './Admin.module.css'
import f from './FAQCMS.module.css'
import { IconEdit, IconTrash, IconX, IconCheck, IconChevronUp, IconChevronDown } from '../../components/AdminIcons'

export default function FAQCMS() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [editData, setEditData] = useState({})
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')

  useEffect(() => {
    fetch('/api/faq')
      .then(r => r.json())
      .then(data => { setFaqs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const startEdit = faq => {
    setEditing(faq.id)
    setEditData({ question: faq.question, answer: faq.answer })
  }

  const saveEdit = async id => {
    const res = await fetch(`/api/faq?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) })
    const data = await res.json()
    setFaqs(list => list.map(x => x.id === id ? data : x))
    setEditing(null)
  }

  const remove = async id => {
    await fetch(`/api/faq?id=${id}`, { method: 'DELETE' })
    setFaqs(list => list.filter(x => x.id !== id))
  }

  const addFaq = async e => {
    e.preventDefault()
    if (!newQ.trim() || !newA.trim()) return
    const sort_order = faqs.length + 1
    const res = await fetch('/api/faq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: newQ, answer: newA, sort_order }) })
    const data = await res.json()
    setFaqs(list => [...list, data])
    setNewQ('')
    setNewA('')
  }

  const moveUp = async id => {
    const idx = faqs.findIndex(x => x.id === id)
    if (idx === 0) return
    const arr = [...faqs]
    ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
    setFaqs(arr)
    await Promise.all([
      fetch(`/api/faq?id=${arr[idx - 1].id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: idx }) }),
      fetch(`/api/faq?id=${arr[idx].id}`,     { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: idx + 1 }) }),
    ])
  }

  const moveDown = async id => {
    const idx = faqs.findIndex(x => x.id === id)
    if (idx === faqs.length - 1) return
    const arr = [...faqs]
    ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
    setFaqs(arr)
    await Promise.all([
      fetch(`/api/faq?id=${arr[idx].id}`,     { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: idx + 1 }) }),
      fetch(`/api/faq?id=${arr[idx + 1].id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: idx + 2 }) }),
    ])
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>FAQ</h1>
          <p className={styles.pageSubtitle}>{loading ? 'Carregando...' : 'Gerencie as perguntas frequentes do site'}</p>
        </div>
      </div>

      <div className={f.faqList}>
        {faqs.map((faq, i) => (
          <div key={faq.id} className={f.faqItem}>
            <div className={f.faqOrder}>
              <button className={f.orderBtn} onClick={() => moveUp(faq.id)} disabled={i === 0} aria-label="Mover para cima">
                <IconChevronUp size={12} />
              </button>
              <span className={f.orderNum}>{i + 1}</span>
              <button className={f.orderBtn} onClick={() => moveDown(faq.id)} disabled={i === faqs.length - 1} aria-label="Mover para baixo">
                <IconChevronDown size={12} />
              </button>
            </div>

            <div className={f.faqContent}>
              {editing === faq.id ? (
                <>
                  <input
                    className={styles.editInput}
                    value={editData.question}
                    onChange={e => setEditData(d => ({ ...d, question: e.target.value }))}
                    style={{ marginBottom: 8 }}
                  />
                  <textarea
                    className={styles.textarea}
                    value={editData.answer}
                    onChange={e => setEditData(d => ({ ...d, answer: e.target.value }))}
                    rows={3}
                  />
                </>
              ) : (
                <>
                  <p className={f.faqQuestion}>{faq.question}</p>
                  <p className={f.faqAnswer}>{faq.answer}</p>
                </>
              )}
            </div>

            <div className={f.faqActions}>
              {editing === faq.id ? (
                <>
                  <button className={styles.actionBtn} onClick={() => saveEdit(faq.id)} title="Salvar">
                    <IconCheck size={13} />
                  </button>
                  <button className={styles.actionBtn} onClick={() => setEditing(null)} title="Cancelar">
                    <IconX size={13} />
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.actionBtn} onClick={() => startEdit(faq)} title="Editar">
                    <IconEdit size={13} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => remove(faq.id)} title="Excluir">
                    <IconTrash size={13} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.form}>
        <p className={styles.formTitle}>Nova Pergunta</p>
        <form onSubmit={addFaq}>
          <div className={styles.field} style={{ marginBottom: 12 }}>
            <label className={styles.label}>Pergunta</label>
            <input required className={styles.input} value={newQ} onChange={e => setNewQ(e.target.value)} placeholder="Digite a pergunta..." />
          </div>
          <div className={styles.field} style={{ marginBottom: 12 }}>
            <label className={styles.label}>Resposta</label>
            <textarea required rows={4} className={styles.textarea} value={newA} onChange={e => setNewA(e.target.value)} placeholder="Digite a resposta..." />
          </div>
          <button type="submit" className={styles.submitBtn}>Adicionar Pergunta</button>
        </form>
      </div>
    </div>
  )
}
