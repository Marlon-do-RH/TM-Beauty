import { useState, useEffect } from 'react'
import styles from './ConsultationModal.module.css'

const SERVICES = ['Brazilian Nanoplastia', 'Brazilian Botox', 'Deep Treatment']

const TOTAL_STEPS = 4

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkSvg} aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

async function uploadToCloudinary(file) {
  const sigRes = await fetch('/api/sign-upload?folder=tm-beauty/consultations')
  if (!sigRes.ok) throw new Error('Could not get upload signature')
  const { signature, timestamp, api_key, cloud_name } = await sigRes.json()

  const form = new FormData()
  form.append('file', file)
  form.append('signature', signature)
  form.append('timestamp', timestamp)
  form.append('api_key', api_key)
  form.append('folder', 'tm-beauty/consultations')

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, {
    method: 'POST',
    body: form,
  })
  if (!uploadRes.ok) throw new Error('Upload failed')
  const data = await uploadRes.json()
  return data.secure_url
}

export default function ConsultationModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [service, setService] = useState(SERVICES[0])
  const [file, setFile] = useState(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [notes, setNotes] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')

  // Close modal on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Auto-close success screen after 4s
  useEffect(() => {
    if (!done) return
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [done, onClose])

  const handleFileChange = async (e) => {
    const picked = e.target.files?.[0]
    if (!picked) return
    setFile(picked)
    setUploading(true)
    setError('')
    try {
      const url = await uploadToCloudinary(picked)
      setPhotoUrl(url)
    } catch {
      setError('Upload failed. You can still proceed — we can request a photo later.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Please enter your name.'); return }
    if (!contact.trim()) { setError('Please enter an email or phone number.'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), contact: contact.trim(), service, notes, photo_url: photoUrl }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setDone(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const canAdvance = () => {
    if (step === 1) return !!service
    if (step === 2) return true // photo is optional
    if (step === 3) return true // notes optional
    return false
  }

  return (
    <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.card} role="dialog" aria-modal="true">

        {/* Header */}
        {!done && (
          <div className={styles.header}>
            <div className={styles.progress}>
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <span key={i} className={`${styles.dot} ${i + 1 <= step ? styles.dotActive : ''}`} />
              ))}
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <CloseIcon />
            </button>
          </div>
        )}

        {/* Success screen */}
        {done && (
          <div className={styles.success}>
            <div className={styles.checkCircle}>
              <CheckIcon />
            </div>
            <h2 className={styles.successTitle}>Request sent!</h2>
            <p className={styles.successText}>
              We will get back to you as soon as possible — within 24 hours.
            </p>
          </div>
        )}

        {/* Step 1 — Service */}
        {!done && step === 1 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>Step 1 of {TOTAL_STEPS}</p>
            <h2 className={styles.stepTitle}>Which service are you interested in?</h2>
            <p className={styles.stepSub}>We will tailor our response to your needs.</p>
            <select
              className={styles.select}
              value={service}
              onChange={e => setService(e.target.value)}
            >
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        {/* Step 2 — Photo / video */}
        {!done && step === 2 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>Step 2 of {TOTAL_STEPS}</p>
            <h2 className={styles.stepTitle}>Show us your hair</h2>
            <p className={styles.stepSub}>Upload a photo or short video of your current hair. This helps Thalita give you the best recommendation.</p>
            <label className={`${styles.uploadArea} ${file ? styles.uploadDone : ''}`}>
              <input
                type="file"
                accept="image/*,video/*"
                className={styles.fileInput}
                onChange={handleFileChange}
              />
              {uploading ? (
                <span className={styles.uploadSpinner} />
              ) : file ? (
                <span className={styles.uploadFileName}>{file.name}</span>
              ) : (
                <>
                  <UploadIcon />
                  <span className={styles.uploadHint}>Click to upload or drag & drop</span>
                  <span className={styles.uploadTypes}>JPG, PNG, MP4, MOV — max 50 MB</span>
                </>
              )}
            </label>
            {error && <p className={styles.errorMsg}>{error}</p>}
          </div>
        )}

        {/* Step 3 — Notes */}
        {!done && step === 3 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>Step 3 of {TOTAL_STEPS}</p>
            <h2 className={styles.stepTitle}>Tell us more</h2>
            <p className={styles.stepSub}>Describe your hair, any concerns, or what result you are looking to achieve.</p>
            <textarea
              className={styles.textarea}
              rows={5}
              placeholder="e.g. My hair is very frizzy and I had a colour treatment 3 months ago..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
        )}

        {/* Step 4 — Contact */}
        {!done && step === 4 && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>Step 4 of {TOTAL_STEPS}</p>
            <h2 className={styles.stepTitle}>How can we reach you?</h2>
            <p className={styles.stepSub}>We will get back to you within 24 hours.</p>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.label}>Your name *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email or phone *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="email@example.com or +61 400 000 000"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                />
              </div>
            </div>
            {error && <p className={styles.errorMsg}>{error}</p>}
          </div>
        )}

        {/* Footer buttons */}
        {!done && (
          <div className={styles.footer}>
            {step > 1 && (
              <button className={styles.backBtn} onClick={() => { setStep(s => s - 1); setError('') }}>
                Back
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                className={styles.nextBtn}
                onClick={() => { setStep(s => s + 1); setError('') }}
                disabled={!canAdvance() || uploading}
              >
                {uploading ? 'Uploading…' : 'Next →'}
              </button>
            ) : (
              <button
                className={styles.nextBtn}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Sending…' : 'Send Request'}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
