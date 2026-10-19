import { useState, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useAdminAuth } from '../../context/AdminAuth'
import BookingButton from '../../components/BookingButton'
import { EditOverlay, ReplaceBtn, DeleteBtn } from '../../components/InlineEdit'
import { uploadToCloudinary, saveSiteMedia, deleteSiteMedia } from '../../lib/uploadMedia'
import { IconPlus, IconEdit } from '../../components/AdminIcons'
import styles from './PageCommon.module.css'
import s from './Servicos.module.css'
import ie from '../../components/InlineEdit.module.css'

const SERVICE_KEYS = [
  { key: 'nano', benefits: ['b1', 'b2', 'b3', 'b4'], icon: '✦', price_min: 280, duration: '3–4', duration_unit: 'hours' },
  { key: 'botox', benefits: ['b1', 'b2', 'b3', 'b4'], icon: '✧', price_min: 220, duration: '2–3', duration_unit: 'hours' },
  { key: 'deep', benefits: ['b1', 'b2', 'b3', 'b4'], icon: '◈', price_min: 180, duration: '1–2', duration_unit: 'hours' },
]

const EMPTY_FORM = { name: '', description: '', price_min: '', duration: '', duration_unit: 'hours' }

const normalizeUnit = (u) => (u === 'horas' ? 'hours' : u === 'minutos' ? 'minutes' : (u || 'hours'))

const isHours = (unit) => unit === 'horas' || unit === 'hours'

const formatPrice = (min, max) => {
  const nmin = Number(min) || 0
  const nmax = Number(max) || 0
  if (nmax > nmin) return `A$${nmin} – A$${nmax}`
  return `A$${nmin}`
}

const formatDuration = (duration, unit) => {
  if (!duration) return ''
  return `${duration}${isHours(unit) ? 'h' : 'min'}`
}

const matchServiceKey = (svc) => {
  const hay = `${svc?.name || ''} ${svc?.description || ''}`.toLowerCase()
  if (hay.includes('nano')) return 'nano'
  if (hay.includes('botox') || hay.includes('bótox')) return 'botox'
  if (hay.includes('deep')) return 'deep'
  return null
}

const iconForKey = (key) => SERVICE_KEYS.find(sk => sk.key === key)?.icon || '✦'

const mediaSection = (id) => `service:${id}`

const photosFromMedia = (list) => {
  const map = {}
  for (const item of list) {
    if (typeof item.section_id === 'string' && item.section_id.startsWith('service:')) {
      map[item.section_id.slice('service:'.length)] = item
    }
  }
  return map
}

export default function Servicos() {
  const { t } = useLanguage()
  const { isAdmin } = useAdminAuth()
  const [liveServices, setLiveServices] = useState(null)
  const [photos, setPhotos] = useState({})
  const [busy, setBusy] = useState(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [photoFile, setPhotoFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)

  const load = () => {
    Promise.all([
      fetch('/api/services').then(r => r.json()),
      fetch('/api/site-media').then(r => r.json()).catch(() => []),
    ])
      .then(([data, media]) => {
        setLiveServices(Array.isArray(data) ? data : [])
        setPhotos(photosFromMedia(Array.isArray(media) ? media : []))
      })
      .catch(() => setLiveServices([]))
  }

  useEffect(() => { load() }, [isAdmin])

  const startEdit = (svc) => {
    setAdding(false)
    setEditingId(svc.id)
    setEditForm({
      name: svc.name || '',
      description: svc.description || '',
      price_min: svc.price_min ?? '',
      duration: svc.duration || '',
      duration_unit: normalizeUnit(svc.duration_unit),
    })
  }

  const savePhoto = async (serviceId, file, caption) => {
    const url = await uploadToCloudinary(file, 'tm-beauty/services')
    const existing = photos[String(serviceId)]
    if (existing?.id) await deleteSiteMedia(existing.id)
    const saved = await saveSiteMedia({
      section_id: mediaSection(serviceId),
      url,
      caption: caption || null,
    })
    setPhotos(map => ({ ...map, [String(serviceId)]: saved }))
  }

  const addService = async (e) => {
    e.preventDefault()
    setBusy('add')
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price_min: Number(form.price_min) || 0,
        price_max: 0,
        duration: form.duration,
        duration_unit: normalizeUnit(form.duration_unit),
        active: true,
        sort_order: (liveServices?.length || 0) + 1,
      }
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not add service')
      const pendingPhoto = photoFile
      setLiveServices(list => [...(list || []), data])
      setForm(EMPTY_FORM)
      setPhotoFile(null)
      setAdding(false)
      if (pendingPhoto) {
        try {
          await savePhoto(data.id, pendingPhoto, data.name)
        } catch (photoErr) {
          alert(photoErr.message || 'Service saved, but the photo could not be uploaded')
        }
      }
    } catch (err) {
      alert(err.message || 'Could not add service')
    } finally {
      setBusy(null)
    }
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    if (!editingId) return
    setBusy(editingId)
    try {
      const payload = {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        price_min: Number(editForm.price_min) || 0,
        duration: editForm.duration,
        duration_unit: normalizeUnit(editForm.duration_unit),
      }
      const res = await fetch(`/api/services?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not update service')
      setLiveServices(list => (list || []).map(x => (x.id === editingId ? data : x)))
      setEditingId(null)
    } catch (err) {
      alert(err.message || 'Could not update service')
    } finally {
      setBusy(null)
    }
  }

  const replacePhoto = async (svc, file) => {
    if (!svc?.id) return
    setBusy(svc.id)
    try {
      await savePhoto(svc.id, file, svc.name)
    } catch (err) {
      alert(err.message || 'Could not update photo')
    } finally {
      setBusy(null)
    }
  }

  const removeService = async (svc) => {
    if (!svc?.id) return
    if (!window.confirm('Remove this service?')) return
    setBusy(svc.id)
    try {
      const existing = photos[String(svc.id)]
      if (existing?.id) await deleteSiteMedia(existing.id)
      const res = await fetch(`/api/services?id=${svc.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not delete service')
      }
      setLiveServices(list => (list || []).filter(x => x.id !== svc.id))
      setPhotos(map => {
        const next = { ...map }
        delete next[String(svc.id)]
        return next
      })
      if (editingId === svc.id) setEditingId(null)
    } catch (err) {
      alert(err.message || 'Could not delete service')
    } finally {
      setBusy(null)
    }
  }

  const apiRows = Array.isArray(liveServices)
    ? (isAdmin ? liveServices : liveServices.filter(svc => svc.active !== false))
    : []

  const useFallback = liveServices !== null && apiRows.length === 0 && !isAdmin

  const cards = useFallback
    ? SERVICE_KEYS.map(sk => {
        const data = t('servicos', sk.key)
        return {
          id: null,
          key: sk.key,
          icon: sk.icon,
          name: data?.name,
          tagline: data?.tagline,
          description: data?.desc,
          benefits: sk.benefits.map(b => data?.[b]).filter(Boolean),
          priceLabel: formatPrice(sk.price_min),
          durationLabel: formatDuration(sk.duration, sk.duration_unit),
          bookTo: `/agendar?service=${sk.key}`,
          raw: null,
        }
      })
    : apiRows.map(svc => {
        const key = matchServiceKey(svc)
        const data = key ? t('servicos', key) : null
        return {
          id: svc.id,
          key: key || String(svc.id),
          icon: iconForKey(key),
          name: svc.name || data?.name,
          tagline: data?.tagline,
          description: svc.description || data?.desc,
          benefits: key ? ['b1', 'b2', 'b3', 'b4'].map(b => data?.[b]).filter(Boolean) : [],
          priceLabel: formatPrice(svc.price_min, svc.price_max),
          durationLabel: formatDuration(svc.duration, svc.duration_unit),
          bookTo: `/agendar?service=${key || svc.id}`,
          raw: svc,
        }
      })

  const renderFields = (values, setValues, extra) => (
    <>
      <input
        className={s.addInput}
        required
        placeholder="Name"
        value={values.name}
        onChange={e => setValues(f => ({ ...f, name: e.target.value }))}
      />
      <textarea
        className={`${s.addInput} ${s.addTextarea}`}
        rows={3}
        placeholder="Description"
        value={values.description}
        onChange={e => setValues(f => ({ ...f, description: e.target.value }))}
      />
      <input
        className={s.addInput}
        required
        type="number"
        min="0"
        placeholder="List price (A$)"
        value={values.price_min}
        onChange={e => setValues(f => ({ ...f, price_min: e.target.value }))}
      />
      <input
        className={s.addInput}
        required
        placeholder="Duration"
        value={values.duration}
        onChange={e => setValues(f => ({ ...f, duration: e.target.value }))}
      />
      <select
        className={s.addInput}
        value={values.duration_unit}
        onChange={e => setValues(f => ({ ...f, duration_unit: e.target.value }))}
      >
        <option value="hours">hours</option>
        <option value="minutes">minutes</option>
      </select>
      {extra}
    </>
  )

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('servicos', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('servicos', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('servicos', 'subtitle')}</p>
        </div>
      </section>

      <section className={s.servicesSection}>
        <div className={s.inner}>
          {isAdmin && (
            <div className={s.adminBar}>
              {!adding ? (
                <button
                  type="button"
                  className={s.addPairBtn}
                  onClick={() => { setEditingId(null); setAdding(true) }}
                >
                  <IconPlus size={14} /> Add service
                </button>
              ) : (
                <form className={s.addForm} onSubmit={addService}>
                  {renderFields(form, setForm, (
                    <label className={s.fileLabel}>
                      {photoFile ? photoFile.name : 'Service photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setPhotoFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  ))}
                  <button type="submit" className={s.addPairBtn} disabled={busy === 'add'}>
                    {busy === 'add' ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className={s.cancelBtn}
                    onClick={() => { setAdding(false); setPhotoFile(null); setForm(EMPTY_FORM) }}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          )}

          {liveServices === null ? (
            <div className={s.loadingRow}>
              <div className={s.spinner} />
            </div>
          ) : cards.length === 0 ? (
            <p className={s.emptyNote}>No services yet. Add the first one above.</p>
          ) : (
            cards.map((sv, i) => {
              const photo = sv.id ? photos[String(sv.id)] : null
              const editing = isAdmin && sv.id && editingId === sv.id
              return (
                <div key={sv.id || sv.key} className={`${s.serviceRow} ${i % 2 !== 0 ? s.serviceRowReverse : ''}`}>
                  <div className={s.serviceVisual}>
                    <div
                      className={s.servicePlaceholder}
                      style={photo?.url ? {
                        backgroundImage: `url(${photo.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      } : undefined}
                    >
                      {!photo?.url && (
                        <span className={s.servicePlaceholderIcon}>{sv.icon}</span>
                      )}
                      {isAdmin && sv.id && (
                        <EditOverlay>
                          <ReplaceBtn
                            title={photo?.url ? 'Replace photo' : 'Add photo'}
                            onFile={(file) => replacePhoto(sv.raw, file)}
                            disabled={!!busy}
                          />
                        </EditOverlay>
                      )}
                      {busy === sv.id && <div className={ie.busy} />}
                    </div>
                  </div>
                  <div className={s.serviceContent}>
                    {editing ? (
                      <form className={s.addForm} onSubmit={saveEdit}>
                        {renderFields(editForm, setEditForm)}
                        <button type="submit" className={s.addPairBtn} disabled={!!busy}>
                          {busy === sv.id ? 'Saving…' : 'Save'}
                        </button>
                        <button type="button" className={s.cancelBtn} onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        <p className={styles.eyebrow}>{t('servicos', 'treatmentEyebrow')}</p>
                        <h2 className={s.serviceName}>{sv.name}</h2>
                        {sv.tagline && <p className={s.serviceTagline}>{sv.tagline}</p>}
                        {sv.description && <p className={s.serviceDesc}>{sv.description}</p>}
                        {sv.benefits.length > 0 && (
                          <ul className={s.benefits}>
                            {sv.benefits.map((b, idx) => (
                              <li key={idx} className={s.benefit}>
                                <span className={s.benefitDot}>✓</span> {b}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className={s.serviceMeta}>
                          <span className={s.servicePrice}>{t('servicos', 'from')} {sv.priceLabel}</span>
                          {sv.durationLabel && (
                            <span className={s.serviceDuration}>⏱ {sv.durationLabel}</span>
                          )}
                        </div>
                        <BookingButton
                          label={t('servicos', 'bookThis')}
                          variant="primary"
                          to={sv.bookTo}
                        />
                        {isAdmin && sv.id && (
                          <div className={s.cardEdit}>
                            <button
                              type="button"
                              className={s.editBtn}
                              onClick={() => startEdit(sv.raw)}
                              disabled={!!busy}
                            >
                              <IconEdit size={13} /> Edit
                            </button>
                            <DeleteBtn title="Remove service" onClick={() => removeService(sv.raw)} disabled={!!busy} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      <section className={s.guideSection}>
        <div className={s.guideInner}>
          <div className={s.guideCopy}>
            <p className={styles.eyebrow}>{t('servicos', 'guideEyebrow')}</p>
            <h2 className={s.guideTitle}>{t('servicos', 'guideTitle')}</h2>
            <h3 className={s.guideHowTitle}>{t('servicos', 'guideHowTitle')}</h3>
            <p className={s.guideHowText}>{t('servicos', 'guideHowText')}</p>
            <p className={s.guideNote}>{t('servicos', 'guideNote')}</p>
          </div>
          <div className={s.ruler} role="img" aria-label={t('servicos', 'guideTitle')}>
            <div className={s.rulerLine} aria-hidden="true" />
            <div className={s.rulerMarks}>
              {[
                ['guideShort', 'guideShortRange'],
                ['guideMedium', 'guideMediumRange'],
                ['guideLong', 'guideLongRange'],
                ['guideExtra', 'guideExtraRange'],
              ].map(([nameKey, rangeKey]) => (
                <div key={nameKey} className={s.rulerMark}>
                  <span className={s.rulerTick} />
                  <span className={s.rulerName}>{t('servicos', nameKey)}</span>
                  <span className={s.rulerRange}>{t('servicos', rangeKey)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
