import { useState, useEffect } from 'react'
import styles from './Admin.module.css'
import r from './ReviewsCMS.module.css'
import { IconEdit, IconTrash, IconX, IconCheck, IconStar, IconPlus } from '../../components/AdminIcons'
import { DEFAULT_REVIEWS } from '../../data/reviewsData'

const STORAGE_KEY = 'tm_reviews'
const NEXT_ID_KEY = 'tm_reviews_next_id'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_REVIEWS
}

function save(reviews) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)) } catch {}
}

function nextId() {
  try {
    const n = parseInt(localStorage.getItem(NEXT_ID_KEY) || '100', 10) + 1
    localStorage.setItem(NEXT_ID_KEY, String(n))
    return n
  } catch {
    return Date.now()
  }
}

const EMPTY_FORM = { name: '', stars: 5, text: '', featured: true }

export default function ReviewsCMS() {
  const [reviews, setReviews] = useState(load)
  const [modal, setModal] = useState(null) // null | { mode: 'add' | 'edit', review }
  const [form, setForm] = useState(EMPTY_FORM)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    save(reviews)
    setSaved(true)
    const t = setTimeout(() => setSaved(false), 1800)
    return () => clearTimeout(t)
  }, [reviews])

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setModal({ mode: 'add' })
  }

  const openEdit = rv => {
    setForm({ name: rv.name, stars: rv.stars, text: rv.text, featured: rv.featured })
    setModal({ mode: 'edit', review: rv })
  }

  const handleSave = e => {
    e.preventDefault()
    if (modal.mode === 'add') {
      setReviews(prev => [...prev, { ...form, id: nextId() }])
    } else {
      setReviews(prev => prev.map(rv => rv.id === modal.review.id ? { ...rv, ...form } : rv))
    }
    setModal(null)
  }

  const remove = id => setReviews(prev => prev.filter(rv => rv.id !== id))

  const toggleFeatured = id =>
    setReviews(prev => prev.map(rv => rv.id === id ? { ...rv, featured: !rv.featured } : rv))

  const featuredCount = reviews.filter(rv => rv.featured).length

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Avaliações</h1>
          <p className={styles.pageSubtitle}>
            Gerencie as avaliações exibidas na página inicial. Marque até 3 como <strong>Destaque</strong> para aparecerem no site.
          </p>
        </div>
        <div className={r.headerRight}>
          {saved && (
            <span className={r.savedBadge}><IconCheck size={12} /> Salvo</span>
          )}
          <button className={styles.submitBtn} onClick={openAdd}>
            <IconPlus size={14} /> Nova Avaliação
          </button>
        </div>
      </div>

      <div className={r.infoBar}>
        <IconStar size={14} />
        <span>{featuredCount} de {reviews.length} avaliações em destaque na página inicial</span>
      </div>

      <div className={r.list}>
        {reviews.map(rv => (
          <div key={rv.id} className={`${r.card} ${rv.featured ? r.cardFeatured : ''}`}>
            <div className={r.cardTop}>
              <div className={r.cardMeta}>
                <span className={r.cardName}>{rv.name}</span>
                <span className={r.cardStars}>{'★'.repeat(rv.stars)}{'☆'.repeat(5 - rv.stars)}</span>
              </div>
              <div className={r.cardActions}>
                <button
                  className={`${r.featBtn} ${rv.featured ? r.featBtnOn : ''}`}
                  onClick={() => toggleFeatured(rv.id)}
                  title={rv.featured ? 'Remover destaque' : 'Marcar como destaque'}
                >
                  <IconStar size={13} />
                  {rv.featured ? 'Destaque' : 'Destacar'}
                </button>
                <button className={r.actionBtn} onClick={() => openEdit(rv)}>
                  <IconEdit size={13} />
                </button>
                <button className={`${r.actionBtn} ${r.actionBtnDanger}`} onClick={() => remove(rv.id)}>
                  <IconTrash size={13} />
                </button>
              </div>
            </div>
            <p className={r.cardText}>"{rv.text}"</p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className={r.empty}>Nenhuma avaliação ainda. Clique em "Nova Avaliação" para começar.</div>
        )}
      </div>

      {modal && (
        <div className={r.backdrop} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className={r.modal}>
            <div className={r.modalHeader}>
              <h3 className={r.modalTitle}>{modal.mode === 'add' ? 'Nova Avaliação' : 'Editar Avaliação'}</h3>
              <button className={r.closeBtn} onClick={() => setModal(null)}><IconX size={16} /></button>
            </div>
            <form onSubmit={handleSave} className={r.form}>
              <div className={styles.field}>
                <label className={styles.label}>Nome do cliente</label>
                <input
                  required
                  className={styles.input}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Sarah M."
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Estrelas</label>
                <select
                  className={styles.input}
                  value={form.stars}
                  onChange={e => setForm(f => ({ ...f, stars: Number(e.target.value) }))}
                >
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{n} {'★'.repeat(n)}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Texto da avaliação</label>
                <textarea
                  required
                  rows={4}
                  className={styles.textarea}
                  value={form.text}
                  onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="O que o cliente disse..."
                />
              </div>
              <div className={r.checkRow}>
                <input
                  type="checkbox"
                  id="feat"
                  checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className={r.checkbox}
                />
                <label htmlFor="feat" className={r.checkLabel}>Exibir em destaque na página inicial</label>
              </div>
              <div className={r.modalFooter}>
                <button type="button" className={r.cancelBtn} onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>
                  <IconCheck size={14} /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
