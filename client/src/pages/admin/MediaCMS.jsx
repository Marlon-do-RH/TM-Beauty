import { useState, useEffect, useRef } from 'react'
import styles from './Admin.module.css'
import m from './MediaCMS.module.css'
import { IconUpload, IconLink, IconX, IconCamera } from '../../components/AdminIcons'

const SECTIONS = [
  { id: 'hero',       label: 'Home — Hero Photo',                  description: 'Featured image shown on the home page next to the title.', single: true },
  { id: 'studio',     label: 'About Us (studio photos)',           description: 'Studio photo gallery shown on the About Us page.', single: false },
  { id: 'about',      label: 'About Us (profile)',                 description: 'Profile photo shown on the About Us page.', single: true },
  { id: 'experience', label: 'The Experience — Atmosphere Photo',  description: 'Atmosphere image used in the "The Experience" section.', single: true },
]

async function cloudinaryUpload(file) {
  const sigRes = await fetch('/api/sign-upload?folder=tm-beauty/media')
  if (!sigRes.ok) throw new Error('Could not get upload signature')
  const { signature, timestamp, api_key, cloud_name } = await sigRes.json()
  const form = new FormData()
  form.append('file', file)
  form.append('signature', signature)
  form.append('timestamp', timestamp)
  form.append('api_key', api_key)
  form.append('folder', 'tm-beauty/media')
  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: form })
  if (!uploadRes.ok) throw new Error('Cloudinary upload failed')
  const data = await uploadRes.json()
  return data.secure_url
}

function PhotoCard({ photo, onDelete }) {
  return (
    <div className={m.photoCard}>
      <img src={photo.url} alt={photo.caption || 'Photo'} className={m.photoImg} />
      {photo.caption && <p className={m.photoCaption}>{photo.caption}</p>}
      <button className={m.photoDelete} onClick={onDelete} title="Remove photo" aria-label="Remove photo">
        <IconX size={12} />
      </button>
    </div>
  )
}

function UploadZone({ sectionId, single, onSaved }) {
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState(null)
  const [tab, setTab] = useState('file')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()
  const [pendingFile, setPendingFile] = useState(null)

  const handleFile = e => {
    const file = e.target.files[0]
    if (!file) return
    setPendingFile(file)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleAdd = async () => {
    setError('')
    setSaving(true)
    try {
      let finalUrl
      if (tab === 'file') {
        if (!pendingFile) return
        finalUrl = await cloudinaryUpload(pendingFile)
      } else {
        finalUrl = url.trim()
        if (!finalUrl) return
      }
      const res = await fetch('/api/site-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_id: sectionId, url: finalUrl, caption: caption.trim() || null }),
      })
      if (!res.ok) throw new Error('Failed to save')
      const saved = await res.json()
      onSaved(saved)
      setUrl('')
      setCaption('')
      setPreview(null)
      setPendingFile(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const canAdd = saving ? false : tab === 'file' ? !!pendingFile : !!url.trim()

  return (
    <div className={m.uploadZone}>
      <div className={m.uploadTabs}>
        <button className={`${m.uploadTab} ${tab === 'file' ? m.uploadTabActive : ''}`} type="button" onClick={() => setTab('file')}>
          <IconUpload size={13} /> Upload file
        </button>
        <button className={`${m.uploadTab} ${tab === 'url' ? m.uploadTabActive : ''}`} type="button" onClick={() => setTab('url')}>
          <IconLink size={13} /> Paste URL
        </button>
      </div>

      <div className={m.uploadBody}>
        {tab === 'file' ? (
          <label className={m.dropArea}>
            {preview ? (
              <img src={preview} alt="preview" className={m.previewImg} />
            ) : (
              <>
                <span className={m.dropIconWrap}><IconCamera size={28} /></span>
                <span className={m.dropText}>Click or drag a photo here</span>
                <span className={m.dropHint}>JPG, PNG, WEBP — up to 50MB</span>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className={m.fileInput} onChange={handleFile} />
          </label>
        ) : (
          <div className={m.urlRow}>
            <input
              type="url"
              className={styles.input}
              placeholder="https://example.com/photo.jpg"
              value={url}
              onChange={e => { setUrl(e.target.value); setPreview(e.target.value) }}
            />
            {url && <img src={url} alt="preview" className={m.urlPreview} onError={e => { e.target.style.display = 'none' }} />}
          </div>
        )}

        <div className={m.captionRow}>
          <input
            className={styles.input}
            placeholder="Caption (optional)"
            value={caption}
            onChange={e => setCaption(e.target.value)}
          />
          <button type="button" className={styles.submitBtn} style={{ marginTop: 0 }} onClick={handleAdd} disabled={!canAdd}>
            {saving ? 'Saving…' : 'Add Photo'}
          </button>
        </div>
        {error && <p style={{ color: '#c0392b', fontSize: '0.8rem', marginTop: 8 }}>{error}</p>}
      </div>
    </div>
  )
}

export default function MediaCMS() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    fetch('/api/site-media')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setPhotos(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const current = SECTIONS.find(s => s.id === activeSection)
  const sectionPhotos = photos.filter(p => p.section_id === activeSection)

  const handleSaved = (photo) => {
    if (current.single) {
      // Replace any existing photo for this section
      setPhotos(ps => [...ps.filter(p => p.section_id !== activeSection), photo])
    } else {
      setPhotos(ps => [...ps, photo])
    }
  }

  const handleDelete = async (photo) => {
    try {
      await fetch(`/api/site-media?id=${photo.id}`, { method: 'DELETE' })
      setPhotos(ps => ps.filter(p => p.id !== photo.id))
    } catch {}
  }

  const showUpload = !current.single || sectionPhotos.length === 0

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Site Photos</h1>
          <p className={styles.pageSubtitle}>Manage the images shown in each section of the public site</p>
        </div>
      </div>

      <div className={m.layout}>
        <div className={m.sectionList}>
          {SECTIONS.map(s => {
            const count = photos.filter(p => p.section_id === s.id).length
            return (
              <button
                key={s.id}
                className={`${m.sectionBtn} ${activeSection === s.id ? m.sectionBtnActive : ''}`}
                onClick={() => setActiveSection(s.id)}
              >
                <span className={m.sectionBtnLabel}>{s.label}</span>
                <span className={m.sectionBtnCount}>{loading ? '…' : `${count} photo${count !== 1 ? 's' : ''}`}</span>
              </button>
            )
          })}
        </div>

        <div className={m.panel}>
          <div className={m.panelHeader}>
            <div>
              <h2 className={m.panelTitle}>{current.label}</h2>
              <p className={m.panelDesc}>{current.description}</p>
              {current.single && <span className={m.badge}>Accepts 1 photo — a new photo replaces the previous one</span>}
            </div>
          </div>

          {loading ? (
            <p style={{ padding: '24px', color: 'var(--dark-soft)', fontSize: '0.85rem' }}>Loading…</p>
          ) : (
            <>
              {sectionPhotos.length > 0 && (
                <div className={m.photosGrid}>
                  {sectionPhotos.map(p => (
                    <PhotoCard key={p.id} photo={p} onDelete={() => handleDelete(p)} />
                  ))}
                </div>
              )}

              {showUpload && (
                <UploadZone sectionId={activeSection} single={current.single} onSaved={handleSaved} />
              )}

              {current.single && sectionPhotos.length > 0 && (
                <div className={m.replaceNote}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                    onClick={() => handleDelete(sectionPhotos[0])}
                  >
                    <IconX size={12} /> Remove current photo and add a new one
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
