import { useState } from 'react'
import styles from './Admin.module.css'
import f from './FAQCMS.module.css'

const INITIAL_FAQ = [
  { id: 1, question: 'Quanto tempo dura o tratamento de Nanoplastia?', answer: 'O tratamento de Nanoplastia dura em média 3 a 4 horas.' },
  { id: 2, question: 'Posso lavar o cabelo no mesmo dia após o tratamento?', answer: 'Para a Nanoplastia, recomendamos esperar pelo menos 72 horas.' },
  { id: 3, question: 'O tratamento é adequado para cabelos coloridos?', answer: 'Sim! A Nanoplastia e o Botox Capilar são seguros para cabelos coloridos.' },
  { id: 4, question: 'Com que frequência devo repetir o tratamento?', answer: 'A Nanoplastia tem durabilidade de 6 a 8 meses. O Botox Capilar dura em média 3 a 4 meses.' },
  { id: 5, question: 'Os tratamentos contêm formol?', answer: 'Não. Todos os tratamentos são livres de formol e formoldeído.' },
  { id: 6, question: 'Preciso fazer alguma preparação antes do tratamento?', answer: 'Recomendamos vir com o cabelo limpo, sem produtos como leave-in, óleo ou spray.' },
]

export default function FAQCMS() {
  const [faqs, setFaqs] = useState(INITIAL_FAQ)
  const [editing, setEditing] = useState(null)
  const [editData, setEditData] = useState({})
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')

  const startEdit = faq => {
    setEditing(faq.id)
    setEditData({ question: faq.question, answer: faq.answer })
  }

  const saveEdit = id => {
    setFaqs(f => f.map(x => x.id === id ? { ...x, ...editData } : x))
    setEditing(null)
  }

  const remove = id => setFaqs(f => f.filter(x => x.id !== id))

  const addFaq = e => {
    e.preventDefault()
    if (!newQ.trim() || !newA.trim()) return
    setFaqs(f => [...f, { id: Date.now(), question: newQ, answer: newA }])
    setNewQ('')
    setNewA('')
  }

  const moveUp = id => {
    setFaqs(f => {
      const idx = f.findIndex(x => x.id === id)
      if (idx === 0) return f
      const arr = [...f]
      ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
      return arr
    })
  }

  const moveDown = id => {
    setFaqs(f => {
      const idx = f.findIndex(x => x.id === id)
      if (idx === f.length - 1) return f
      const arr = [...f]
      ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
      return arr
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>FAQ</h1>
          <p className={styles.pageSubtitle}>Gerencie as perguntas frequentes do site</p>
        </div>
      </div>

      <div className={f.faqList}>
        {faqs.map((faq, i) => (
          <div key={faq.id} className={f.faqItem}>
            <div className={f.faqOrder}>
              <button className={f.orderBtn} onClick={() => moveUp(faq.id)} disabled={i === 0}>▲</button>
              <span className={f.orderNum}>{i + 1}</span>
              <button className={f.orderBtn} onClick={() => moveDown(faq.id)} disabled={i === faqs.length - 1}>▼</button>
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
                  <button className={styles.actionBtn} onClick={() => saveEdit(faq.id)}>✓</button>
                  <button className={styles.actionBtn} onClick={() => setEditing(null)}>✕</button>
                </>
              ) : (
                <>
                  <button className={styles.actionBtn} onClick={() => startEdit(faq)}>✎</button>
                  <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => remove(faq.id)}>✕</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.form}>
        <p className={styles.formTitle}>+ Nova Pergunta</p>
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
