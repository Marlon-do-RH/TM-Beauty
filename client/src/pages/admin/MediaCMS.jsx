import { useState, useRef } from 'react'
import styles from './Admin.module.css'
import m from './MediaCMS.module.css'
import { IconUpload, IconLink, IconX, IconCamera } from '../../components/AdminIcons'

const INITIAL_SECTIONS = [
  {
    id: 'hero',
    label: 'Home — Foto Principal (Hero)',
    description: 'Imagem de destaque exibida na página inicial ao lado do título.',
    single: true,
    photos: [],
  },
  {
    id: 'studio',
    label: 'O Studio — Fotos do Espaço',
    description: 'Galeria de fotos do ambiente do studio exibidas na página "O Studio".',
    single: false,
    photos: [],
  },
  {
    id: 'about',
    label: 'Sobre Thalita — Foto do Perfil',
    description: 'Foto exibida na página "Sobre Thalita".',
    single: true,
    photos: [],
  },
  {
    id: 'experience',
    label: 'A Experiência — Foto do Ambiente',
    description: 'Imagem de ambiente usada na seção "A Experiência".',
    single: true,
    photos: [],
  },
]

function PhotoCard({ photo, onDelete }) {
  return (
    <div className={m.photoCard}>
      <img src={photo.url} alt={photo.caption || 'Photo'} className={m.photoImg} />
      {photo.caption && <p className={m.photoCaption}>{photo.caption}</p>}
      <button className={m.photoDelete} onClick={onDelete} title="Remover foto" aria-label="Remover foto">
        <IconX size={12} />
      </button>
    </div>
  )
}

function UploadZone({ onAdd }) {
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState(null)
  const [tab, setTab] = useState('file')
  const fileRef = useRef()

  const handleFile = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleAdd = () => {
    const src = tab === 'url' ? url.trim() : preview
    if (!src) return
    onAdd({ url: src, caption })
    setUrl('')
    setCaption('')
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className={m.uploadZone}>
      <div className={m.uploadTabs}>
        <button
          className={`${m.uploadTab} ${tab === 'file' ? m.uploadTabActive : ''}`}
          type="button"
          onClick={() => setTab('file')}
        >
          <IconUpload size={13} /> Upload de arquivo
        </button>
        <button
          className={`${m.uploadTab} ${tab === 'url' ? m.uploadTabActive : ''}`}
          type="button"
          onClick={() => setTab('url')}
        >
          <IconLink size={13} /> Colar URL
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
                <span className={m.dropText}>Clique ou arraste uma foto aqui</span>
                <span className={m.dropHint}>JPG, PNG, WEBP — até 5MB</span>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className={m.fileInput} onChange={handleFile} />
          </label>
        ) : (
          <div className={m.urlRow}>
            <input
              type="url"
              className={styles.input}
              placeholder="https://exemplo.com/foto.jpg"
              value={url}
              onChange={e => { setUrl(e.target.value); setPreview(e.target.value) }}
            />
            {url && (
              <img src={url} alt="preview" className={m.urlPreview} onError={e => { e.target.style.display = 'none' }} />
            )}
          </div>
        )}

        <div className={m.captionRow}>
          <input
            className={styles.input}
            placeholder="Legenda (opcional)"
            value={caption}
            onChange={e => setCaption(e.target.value)}
          />
          <button
            type="button"
            className={styles.submitBtn}
            style={{ marginTop: 0 }}
            onClick={handleAdd}
            disabled={tab === 'file' ? !preview : !url}
          >
            Adicionar Foto
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MediaCMS() {
  const [sections, setSections] = useState(INITIAL_SECTIONS)
  const [activeSection, setActiveSection] = useState('hero')

  const current = sections.find(s => s.id === activeSection)

  const addPhoto = (sectionId, photo) => {
    setSections(ss => ss.map(s => {
      if (s.id !== sectionId) return s
      const photos = s.single ? [photo] : [...s.photos, photo]
      return { ...s, photos }
    }))
  }

  const deletePhoto = (sectionId, idx) => {
    setSections(ss => ss.map(s =>
      s.id !== sectionId ? s : { ...s, photos: s.photos.filter((_, i) => i !== idx) }
    ))
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Fotos do Site</h1>
          <p className={styles.pageSubtitle}>Gerencie as imagens exibidas em cada seção do site público</p>
        </div>
      </div>

      <div className={m.layout}>
        <div className={m.sectionList}>
          {sections.map(s => (
            <button
              key={s.id}
              className={`${m.sectionBtn} ${activeSection === s.id ? m.sectionBtnActive : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span className={m.sectionBtnLabel}>{s.label}</span>
              <span className={m.sectionBtnCount}>{s.photos.length} foto{s.photos.length !== 1 ? 's' : ''}</span>
            </button>
          ))}
        </div>

        <div className={m.panel}>
          <div className={m.panelHeader}>
            <div>
              <h2 className={m.panelTitle}>{current.label}</h2>
              <p className={m.panelDesc}>{current.description}</p>
              {current.single && (
                <span className={m.badge}>Aceita 1 foto — nova foto substitui a anterior</span>
              )}
            </div>
          </div>

          {current.photos.length > 0 && (
            <div className={m.photosGrid}>
              {current.photos.map((p, i) => (
                <PhotoCard key={i} photo={p} onDelete={() => deletePhoto(current.id, i)} />
              ))}
            </div>
          )}

          {(!current.single || current.photos.length === 0) && (
            <UploadZone
              single={current.single}
              onAdd={photo => addPhoto(current.id, photo)}
            />
          )}

          {current.single && current.photos.length > 0 && (
            <div className={m.replaceNote}>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                onClick={() => deletePhoto(current.id, 0)}
              >
                <IconX size={12} /> Remover foto atual e adicionar nova
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
