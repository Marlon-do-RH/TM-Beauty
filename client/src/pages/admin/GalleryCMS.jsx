import { useState, useEffect, useRef } from 'react'
import styles from './Admin.module.css'
import g from './GalleryCMS.module.css'
import { IconTrash, IconCamera, IconImage, IconStar } from '../../components/AdminIcons'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'rhknykmy'
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'tm_beauty_upload'
const categories = ['Nanoplastia', 'Botox', 'Deep Treatment']

async function uploadToCloudinary(file, folder = 'tm-beauty/gallery') {
  // Get a server-side signature — no preset needed
  const { signature, timestamp, api_key, cloud_name } = await fetch(
    `/api/sign-upload?folder=${encodeURIComponent(folder)}`
  ).then(r => r.json())

  const fd = new FormData()
  fd.append('file', file)
  fd.append('api_key', api_key)
  fd.append('timestamp', String(timestamp))
  fd.append('folder', folder)
  fd.append('signature', signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
  const data = await res.json()
  if (!data.secure_url) throw new Error(data.error?.message || 'Upload failed')
  return data.secure_url
}

export default function GalleryCMS() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ category: 'Nanoplastia', caption: '' })
  const [beforeFile, setBeforeFile] = useState(null)
  const [afterFile, setAfterFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState('all')
  const beforeRef = useRef()
  const afterRef = useRef()

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const addItem = async e => {
    e.preventDefault()
    setUploading(true)
    try {
      const [before_url, after_url] = await Promise.all([
        beforeFile ? uploadToCloudinary(beforeFile) : Promise.resolve(''),
        afterFile  ? uploadToCloudinary(afterFile)  : Promise.resolve(''),
      ])
      const payload = { category: form.category, caption: form.caption, before_url, after_url, section: 'gallery' }
      const res = await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      setItems(it => [...it, data])
      setForm(f => ({ ...f, caption: '' }))
      setBeforeFile(null)
      setAfterFile(null)
      if (beforeRef.current) beforeRef.current.value = ''
      if (afterRef.current) afterRef.current.value = ''
    } catch (err) {
      alert('Upload error: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const remove = async id => {
    await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' })
    setItems(it => it.filter(x => x.id !== id))
  }

  const toggleFeatured = async item => {
    const newVal = !item.featured
    const res = await fetch(`/api/gallery?id=${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: newVal }),
    })
    const updated = await res.json()
    setItems(it => it.map(x => {
      if (x.id === updated.id) return updated
      if (newVal && x.category === item.category) return { ...x, featured: false }
      return x
    }))
  }

  const filtered = filter === 'all' ? items : items.filter(x => x.category === filter)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gallery</h1>
          <p className={styles.pageSubtitle}>{loading ? 'Loading...' : 'Manage before & after photos'}</p>
        </div>
      </div>

      <div className={styles.form}>
        <p className={styles.formTitle}>Add Photo Pair</p>
        <form onSubmit={addItem}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select className={styles.select} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field} style={{ flex: 2 }}>
              <label className={styles.label}>Caption</label>
              <input required className={styles.input} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="e.g. Curly hair — silky straight" />
            </div>
          </div>

          <div className={g.uploadRow}>
            <label className={g.uploadBox}>
              <span className={g.uploadIconWrap}><IconCamera size={22} /></span>
              <span className={g.uploadLabel}>{beforeFile ? beforeFile.name : 'Photo — Before'}</span>
              <span className={g.uploadSub}>Drag or click to select</span>
              <input ref={beforeRef} type="file" accept="image/*" className={g.fileInput} onChange={e => setBeforeFile(e.target.files[0] || null)} />
            </label>
            <label className={g.uploadBox}>
              <span className={g.uploadIconWrap}><IconImage size={22} /></span>
              <span className={g.uploadLabel}>{afterFile ? afterFile.name : 'Photo — After'}</span>
              <span className={g.uploadSub}>Drag or click to select</span>
              <input ref={afterRef} type="file" accept="image/*" className={g.fileInput} onChange={e => setAfterFile(e.target.files[0] || null)} />
            </label>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Add to Gallery'}
          </button>
        </form>
      </div>

      <div className={styles.filterRow}>
        {['all', ...categories].map(c => (
          <button key={c} className={`${styles.filterBtn} ${filter === c ? styles.filterBtnActive : ''}`} onClick={() => setFilter(c)}>
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      <div className={g.galleryGrid}>
        {filtered.map(item => (
          <div key={item.id} className={`${g.galleryCard} ${item.featured ? g.isFeatured : ''}`}>
            <div className={g.galleryImages}>
              <div className={g.imgBox} style={item.before_url ? { backgroundImage: `url(${item.before_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                <span className={g.imgTag}>Before</span>
              </div>
              <div className={`${g.imgBox} ${g.imgBoxAfter}`} style={item.after_url ? { backgroundImage: `url(${item.after_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                <span className={g.imgTag}>After</span>
              </div>
            </div>
            <div className={g.cardInfo}>
              <span className={g.cardCategory}>{item.category}</span>
              <p className={g.cardCaption}>{item.caption}</p>
              <div className={g.cardFooter}>
                <span className={g.cardDate}>{item.created_at?.slice(0, 10) || ''}</span>
                <div className={g.cardActions}>
                  <button
                    className={`${styles.actionBtn} ${item.featured ? g.featuredBtn : ''}`}
                    onClick={() => toggleFeatured(item)}
                    title={item.featured ? 'Featured on home page — click to unfeature' : 'Set as featured on home page'}
                  >
                    <IconStar size={13} /> {item.featured ? 'Featured' : 'Feature'}
                  </button>
                  <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => remove(item.id)}>
                    <IconTrash size={12} /> Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
