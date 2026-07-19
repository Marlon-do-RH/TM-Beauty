import { useState, useEffect, useRef } from 'react'
import styles from './ConsultationModal.module.css'

const SERVICES = [
  'Brazilian Nanoplastia',
  'Brazilian Botox',
  'Deep Treatment',
  'Other / Not sure yet',
]

const INITIAL = {
  service: '',
  files: [],
  message: '',
  name: '',
  email: '',
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  )
}

export default function ConsultationModal({ open, onClose }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL)
  const [done, setDone] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = e => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep(1)
      setForm(INITIAL)
      setDone(false)
    }, 300)
  }

  const addFiles = newFiles => {
    setForm(f => ({
      ...f,
      files: [...f.files, ...Array.from(newFiles)].slice(0, 5),
    }))
  }

  const removeFile = i =>
    setForm(f => ({ ...f, files: f.files.filter((_, idx) => idx !== i) }))

  const handleSubmit = e => {
    e.preventDefault()
    setDone(true)
  }

  if (!open) return null

  const backdropClick = e => { if (e.target === e.currentTarget) handleClose() }

  const progress = done ? 100 : ((step - 1) / 3) * 100

  return (
    <div className={styles.backdrop} onClick={backdropClick} aria-modal="true" role="dialog">
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <p className={styles.eyebrow}>TM Beauty</p>
            <h2 className={styles.title}>Free Consultation</h2>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Progress bar */}
        {!done && (
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${((step) / 3) * 100}%` }} />
          </div>
        )}

        <div className={styles.body}>
          {done ? (
            /* ── Thank you ── */
            <div className={styles.thankYou}>
              <div className={styles.checkCircle}><CheckIcon /></div>
              <h3 className={styles.thankTitle}>Request Received!</h3>
              <p className={styles.thankText}>
                Thank you, <strong>{form.name}</strong>! Thalita will review your consultation request and get back to you at <strong>{form.email}</strong> within 24 hours.
              </p>
              <button className={styles.doneBtn} onClick={handleClose}>Close</button>
            </div>
          ) : step === 1 ? (
            /* ── Step 1: Service ── */
            <div className={styles.step}>
              <p className={styles.stepLabel}>Step 1 of 3</p>
              <h3 className={styles.stepTitle}>What service are you interested in?</h3>
              <div className={styles.serviceList}>
                {SERVICES.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`${styles.serviceOption} ${form.service === s ? styles.serviceOptionSelected : ''}`}
                    onClick={() => setForm(f => ({ ...f, service: s }))}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className={styles.stepFooter}>
                <button
                  className={styles.nextBtn}
                  disabled={!form.service}
                  onClick={() => setStep(2)}
                >
                  Next
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            /* ── Step 2: Media ── */
            <div className={styles.step}>
              <p className={styles.stepLabel}>Step 2 of 3</p>
              <h3 className={styles.stepTitle}>Share a photo or video of your hair</h3>
              <p className={styles.stepSub}>Optional — helps Thalita give you the most accurate consultation. Up to 5 files.</p>

              <div
                className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
                onClick={() => fileRef.current?.click()}
              >
                <UploadIcon />
                <p className={styles.dropText}>Drag &amp; drop or <span className={styles.dropLink}>browse</span></p>
                <p className={styles.dropHint}>JPG, PNG, MP4 — max 5 files</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className={styles.fileInput}
                  onChange={e => addFiles(e.target.files)}
                />
              </div>

              {form.files.length > 0 && (
                <ul className={styles.fileList}>
                  {form.files.map((f, i) => (
                    <li key={i} className={styles.fileItem}>
                      <span className={styles.fileName}>{f.name}</span>
                      <button type="button" className={styles.removeFile} onClick={() => removeFile(i)} aria-label="Remove">
                        <CloseIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.stepFooter}>
                <button className={styles.backBtn} onClick={() => setStep(1)}>Back</button>
                <button className={styles.nextBtn} onClick={() => setStep(3)}>
                  Next
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          ) : (
            /* ── Step 3: Details ── */
            <form className={styles.step} onSubmit={handleSubmit}>
              <p className={styles.stepLabel}>Step 3 of 3</p>
              <h3 className={styles.stepTitle}>Almost done — a few details</h3>

              <div className={styles.field}>
                <label className={styles.label}>Your name</label>
                <input
                  required
                  className={styles.input}
                  placeholder="e.g. Sarah"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email address</label>
                <input
                  required
                  type="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Questions or comments <span className={styles.optional}>(optional)</span></label>
                <textarea
                  rows={4}
                  className={styles.textarea}
                  placeholder="Any questions or extra details about your hair..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
              </div>

              <div className={styles.stepFooter}>
                <button type="button" className={styles.backBtn} onClick={() => setStep(2)}>Back</button>
                <button type="submit" className={styles.submitBtn}>
                  Send Request
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
