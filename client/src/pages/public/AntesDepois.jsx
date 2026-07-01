import { useState } from 'react'
import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'
import s from './AntesDepois.module.css'

const categories = ['Todos', 'Nanoplastia', 'Botox', 'Deep Treatment']

const pairs = [
  { category: 'Nanoplastia', label: 'Cabelo cacheado → liso sedoso' },
  { category: 'Botox', label: 'Volume excessivo → fios controlados' },
  { category: 'Nanoplastia', label: 'Frizz intenso → brilho natural' },
  { category: 'Deep Treatment', label: 'Pontas ressecadas → fios hidratados' },
  { category: 'Botox', label: 'Cabelo ondulado → levemente alisado' },
  { category: 'Nanoplastia', label: 'Dano químico → restauração completa' },
]

export default function AntesDepois() {
  const [active, setActive] = useState('Todos')

  const filtered = active === 'Todos' ? pairs : pairs.filter(p => p.category === active)

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>Resultados Reais</p>
          <h1 className={styles.pageTitle}>Antes & Depois</h1>
          <p className={styles.pageSubtitle}>Transformações reais de clientes reais. Cada resultado conta uma história única.</p>
        </div>
      </section>

      <section className={s.gallerySection}>
        <div className={s.inner}>
          <div className={s.filterRow}>
            {categories.map(c => (
              <button
                key={c}
                className={`${s.filterBtn} ${active === c ? s.filterBtnActive : ''}`}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className={s.grid}>
            {filtered.map((p, i) => (
              <div key={i} className={s.pairCard}>
                <div className={s.pairImages}>
                  <div className={s.pairImg}>
                    <span className={s.pairTag}>Antes</span>
                  </div>
                  <div className={`${s.pairImg} ${s.pairImgAfter}`}>
                    <span className={s.pairTag}>Depois</span>
                  </div>
                </div>
                <div className={s.pairInfo}>
                  <span className={s.pairCategory}>{p.category}</span>
                  <p className={s.pairLabel}>{p.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Quer ser a próxima transformação?</h2>
        <p className={styles.ctaText}>Agende sua consulta e comece sua jornada de transformação hoje.</p>
        <BookingButton label="Quero me Transformar" variant="primary" />
      </section>
    </div>
  )
}
