import { useState } from 'react'
import styles from './Admin.module.css'
import g from './GalleryCMS.module.css'
import { IconTrash, IconCamera, IconImage } from '../../components/AdminIcons'

const INITIAL = [
  { id: 1, category: 'Nanoplastia', caption: 'Cabelo cacheado — liso sedoso', date: '2024-05-10' },
  { id: 2, category: 'Botox', caption: 'Volume controlado', date: '2024-05-15' },
  { id: 3, category: 'Deep Treatment', caption: 'Fios hidratados', date: '2024-05-20' },
]

const categories = ['Nanoplastia', 'Botox', 'Deep Treatment']

export default function GalleryCMS() {
  const [items, setItems] = useState(INITIAL)
  const [form, setForm] = useState({ category: 'Nanoplastia', caption: '' })
  const [filter, setFilter] = useState('all')

  const addItem = e => {
    e.preventDefault()
    setItems(it => [...it, { ...form, id: Date.now(), date: new Date().toISOString().slice(0, 10) }])
    setForm(f => ({ ...f, caption: '' }))
  }

  const remove = id => setItems(it => it.filter(x => x.id !== id))

  const filtered = filter === 'all' ? items : items.filter(x => x.category === filter)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Galeria</h1>
          <p className={styles.pageSubtitle}>Gerencie as fotos de antes &amp; depois</p>
        </div>
      </div>

      <div className={styles.form}>
        <p className={styles.formTitle}>Adicionar Par de Fotos</p>
        <form onSubmit={addItem}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Categoria</label>
              <select className={styles.select} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field} style={{ flex: 2 }}>
              <label className={styles.label}>Legenda</label>
              <input required className={styles.input} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Ex: Cabelo cacheado — liso sedoso" />
            </div>
          </div>

          <div className={g.uploadRow}>
            <div className={g.uploadBox}>
              <span className={g.uploadIconWrap}><IconCamera size={22} /></span>
              <span className={g.uploadLabel}>Foto — Antes</span>
              <span className={g.uploadSub}>Arraste ou clique para selecionar</span>
              <input type="file" accept="image/*" className={g.fileInput} />
            </div>
            <div className={g.uploadBox}>
              <span className={g.uploadIconWrap}><IconImage size={22} /></span>
              <span className={g.uploadLabel}>Foto — Depois</span>
              <span className={g.uploadSub}>Arraste ou clique para selecionar</span>
              <input type="file" accept="image/*" className={g.fileInput} />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>Adicionar à Galeria</button>
        </form>
      </div>

      <div className={styles.filterRow}>
        {['all', ...categories].map(c => (
          <button key={c} className={`${styles.filterBtn} ${filter === c ? styles.filterBtnActive : ''}`} onClick={() => setFilter(c)}>
            {c === 'all' ? 'Todos' : c}
          </button>
        ))}
      </div>

      <div className={g.galleryGrid}>
        {filtered.map(item => (
          <div key={item.id} className={g.galleryCard}>
            <div className={g.galleryImages}>
              <div className={g.imgBox}>
                <span className={g.imgTag}>Antes</span>
              </div>
              <div className={`${g.imgBox} ${g.imgBoxAfter}`}>
                <span className={g.imgTag}>Depois</span>
              </div>
            </div>
            <div className={g.cardInfo}>
              <span className={g.cardCategory}>{item.category}</span>
              <p className={g.cardCaption}>{item.caption}</p>
              <div className={g.cardFooter}>
                <span className={g.cardDate}>{item.date}</span>
                <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => remove(item.id)}>
                  <IconTrash size={12} /> Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
