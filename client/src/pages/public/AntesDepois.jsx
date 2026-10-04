import { useState, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useAdminAuth } from '../../context/AdminAuth'
import { EditOverlay, ReplaceBtn, DeleteBtn } from '../../components/InlineEdit'
import {
  uploadToCloudinary,
  saveGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../../lib/uploadMedia'
import { IconPlus } from '../../components/AdminIcons'
import styles from './PageCommon.module.css'
import s from './AntesDepois.module.css'
import ie from '../../components/InlineEdit.module.css'

const PAGE_SIZE = 6

const FALLBACK_PAIRS = [
  { category: 'Nanoplastia', caption: 'Curly hair → silky straight' },
  { category: 'Botox', caption: 'Excess volume → controlled strands' },
  { category: 'Nanoplastia', caption: 'Intense frizz → natural shine' },
  { category: 'Deep Treatment', caption: 'Dry ends → hydrated hair' },
  { category: 'Botox', caption: 'Wavy hair → lightly smoothed' },
  { category: 'Nanoplastia', caption: 'Chemical damage → full restoration' },
]

const FILTERS = [
  { id: 'all', labelKey: 'all' },
  { id: 'Nanoplastia' },
  { id: 'Botox' },
  { id: 'Deep Treatment' },
]

const CATEGORIES = ['Nanoplastia', 'Botox', 'Deep Treatment']

function fill(template, vars) {
  return Object.entries(vars).reduce(
    (str, [k, v]) => str.replaceAll(`{${k}}`, String(v)),
    template,
  )
}

export default function AntesDepois() {
  const { t } = useLanguage()
  const { isAdmin } = useAdminAuth()
  const [active, setActive] = useState('all')
  const [page, setPage] = useState(1)
  const [pairs, setPairs] = useState(null)
  const [busy, setBusy] = useState(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ category: 'Nanoplastia', caption: '' })
  const [beforeFile, setBeforeFile] = useState(null)
  const [afterFile, setAfterFile] = useState(null)

  const loadGallery = () => {
    fetch('/api/gallery?section=gallery')
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : []
        if (isAdmin) {
          setPairs(list.map(d => ({ ...d, label: d.caption })))
          return
        }
        setPairs(list.length > 0 ? list.map(d => ({ ...d, label: d.caption })) : FALLBACK_PAIRS)
      })
      .catch(() => setPairs(isAdmin ? [] : FALLBACK_PAIRS))
  }

  useEffect(() => { loadGallery() }, [isAdmin])

  const setFilter = (id) => {
    setActive(id)
    setPage(1)
  }

  const replaceSide = async (item, side, file) => {
    if (!item?.id) return
    setBusy(item.id)
    try {
      const url = await uploadToCloudinary(file, 'tm-beauty/gallery')
      const payload = side === 'before' ? { before_url: url } : { after_url: url }
      const updated = await updateGalleryItem(item.id, payload)
      setPairs(list => list.map(p => (p.id === item.id ? { ...updated, label: updated.caption } : p)))
    } catch (err) {
      alert(err.message || 'Could not update photo')
    } finally {
      setBusy(null)
    }
  }

  const removePair = async (item) => {
    if (!item?.id) return
    if (!window.confirm('Remove this before & after pair?')) return
    setBusy(item.id)
    try {
      await deleteGalleryItem(item.id)
      setPairs(list => list.filter(p => p.id !== item.id))
    } catch (err) {
      alert(err.message || 'Could not delete pair')
    } finally {
      setBusy(null)
    }
  }

  const addPair = async (e) => {
    e.preventDefault()
    if (!beforeFile || !afterFile) {
      alert('Please choose both a before and an after photo.')
      return
    }
    setBusy('add')
    try {
      const [before_url, after_url] = await Promise.all([
        uploadToCloudinary(beforeFile, 'tm-beauty/gallery'),
        uploadToCloudinary(afterFile, 'tm-beauty/gallery'),
      ])
      await saveGalleryItem({
        category: form.category,
        caption: form.caption,
        before_url,
        after_url,
        section: 'gallery',
      })
      setForm({ category: 'Nanoplastia', caption: '' })
      setBeforeFile(null)
      setAfterFile(null)
      setAdding(false)
      loadGallery()
    } catch (err) {
      alert(err.message || 'Could not add pair')
    } finally {
      setBusy(null)
    }
  }

  const filtered = pairs
    ? (active === 'all' ? pairs : pairs.filter(p => p.category === active))
    : []

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('antesDepois', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('antesDepois', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('antesDepois', 'subtitle')}</p>
        </div>
      </section>

      <section className={s.gallerySection}>
        <div className={s.inner}>
          <div className={s.filterRow}>
            {FILTERS.map(f => (
              <button
                key={f.id}
                className={`${s.filterBtn} ${active === f.id ? s.filterBtnActive : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.labelKey ? t('antesDepois', f.labelKey) : f.id}
              </button>
            ))}
          </div>

          {isAdmin && (
            <div className={s.adminBar}>
              {!adding ? (
                <button type="button" className={s.addPairBtn} onClick={() => setAdding(true)}>
                  <IconPlus size={14} /> Add pair
                </button>
              ) : (
                <form className={s.addForm} onSubmit={addPair}>
                  <select
                    className={s.addInput}
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input
                    className={s.addInput}
                    required
                    placeholder="Caption"
                    value={form.caption}
                    onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                  />
                  <label className={s.fileLabel}>
                    {beforeFile ? beforeFile.name : 'Before photo'}
                    <input type="file" accept="image/*" onChange={e => setBeforeFile(e.target.files?.[0] || null)} />
                  </label>
                  <label className={s.fileLabel}>
                    {afterFile ? afterFile.name : 'After photo'}
                    <input type="file" accept="image/*" onChange={e => setAfterFile(e.target.files?.[0] || null)} />
                  </label>
                  <button type="submit" className={s.addPairBtn} disabled={busy === 'add'}>
                    {busy === 'add' ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className={s.cancelBtn}
                    onClick={() => { setAdding(false); setBeforeFile(null); setAfterFile(null) }}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          )}

          {pairs === null ? (
            <div className={s.loadingRow}>
              <div className={s.spinner} />
            </div>
          ) : (
            <>
              <div className={s.grid}>
                {paged.map((p, i) => (
                  <div key={p.id || i} className={s.pairCard}>
                    <div className={s.pairImages}>
                      <div className={s.pairImg} style={p.before_url ? { backgroundImage: `url(${p.before_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                        <span className={s.pairTag}>{t('antesDepois', 'before')}</span>
                        {isAdmin && p.id && (
                          <EditOverlay>
                            <ReplaceBtn
                              title="Replace before"
                              onFile={(file) => replaceSide(p, 'before', file)}
                              disabled={!!busy}
                            />
                          </EditOverlay>
                        )}
                      </div>
                      <div className={`${s.pairImg} ${s.pairImgAfter}`} style={p.after_url ? { backgroundImage: `url(${p.after_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                        <span className={s.pairTag}>{t('antesDepois', 'after')}</span>
                        {isAdmin && p.id && (
                          <EditOverlay>
                            <ReplaceBtn
                              title="Replace after"
                              onFile={(file) => replaceSide(p, 'after', file)}
                              disabled={!!busy}
                            />
                          </EditOverlay>
                        )}
                      </div>
                    </div>
                    <div className={s.pairInfo}>
                      <span className={s.pairCategory}>{p.category}</span>
                      <p className={s.pairLabel}>{p.caption || p.label}</p>
                      {isAdmin && p.id && (
                        <div className={s.cardEdit}>
                          <DeleteBtn title="Remove pair" onClick={() => removePair(p)} disabled={!!busy} />
                        </div>
                      )}
                    </div>
                    {busy === p.id && <div className={ie.busy} />}
                  </div>
                ))}
              </div>

              {filtered.length > PAGE_SIZE && (
                <div className={s.pagination}>
                  <button
                    type="button"
                    className={s.pageBtn}
                    disabled={safePage <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    {t('antesDepois', 'prevPage')}
                  </button>
                  <span className={s.pageInfo}>
                    {fill(t('antesDepois', 'pageOf'), { current: safePage, total: totalPages })}
                  </span>
                  <button
                    type="button"
                    className={s.pageBtn}
                    disabled={safePage >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    {t('antesDepois', 'nextPage')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
