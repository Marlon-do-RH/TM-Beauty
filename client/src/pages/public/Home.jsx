import { Link } from 'react-router-dom'
import BookingButton from '../../components/BookingButton'
import styles from './Home.module.css'

const stats = [
  { value: '10+', label: 'Anos de Experiência' },
  { value: '3', label: 'Países' },
  { value: '1000+', label: 'Clientes Felizes' },
  { value: '5.0', label: 'Google Reviews' },
]

const services = [
  {
    title: 'Brazilian Nanoplastia',
    desc: 'O tratamento mais avançado de alisamento sem formol. Cabelos lisos, sedosos e com brilho duradouro.',
    price: 'a partir de R$280',
    icon: '✦',
  },
  {
    title: 'Brazilian Botox',
    desc: 'Hidratação profunda e redução de volume. Resultado natural e duradouro por até 4 meses.',
    price: 'a partir de R$220',
    icon: '✧',
  },
  {
    title: 'Deep Treatment',
    desc: 'Tratamento reconstrutivo intensivo que devolve vida e brilho ao cabelo danificado.',
    price: 'a partir de R$180',
    icon: '◈',
  },
]

const reviews = [
  {
    name: 'Sarah M.',
    stars: 5,
    text: 'Absolutely amazing! My hair has never felt this smooth. Thalita is a true artist — so professional and caring.',
  },
  {
    name: 'Camila R.',
    stars: 5,
    text: 'Incredible experience from start to finish. The studio is beautiful and the results are beyond what I expected.',
  },
  {
    name: 'Jessica T.',
    stars: 5,
    text: "I've been going to Thalita for 2 years and I will never go anywhere else. The best hair treatment in Melbourne!",
  },
]

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Brazilian Hair Specialist · Melbourne</p>
          <h1 className={styles.heroTitle}>
            Thalita<br />
            <span className={styles.heroTitleAccent}>Medeiros</span>
          </h1>
          <p className={styles.heroTagline}>
            Especialista em tratamentos capilares brasileiros que transformam cabelos e elevam a autoestima.
          </p>
          <div className={styles.heroCtas}>
            <BookingButton label="Agendar Agora" variant="primary" />
            <Link to="/servicos" className={styles.heroSecondary}>Ver Serviços →</Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroPlaceholder}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeStars}>★★★★★</span>
              <span>5.0 no Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        {stats.map(s => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* Services preview */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>O que ofereço</p>
          <h2 className={styles.sectionTitle}>Tratamentos Especializados</h2>
          <p className={styles.sectionSub}>Técnicas brasileiras exclusivas, aplicadas com precisão e carinho em Melbourne.</p>
        </div>
        <div className={styles.servicesGrid}>
          {services.map(s => (
            <div key={s.title} className={styles.serviceCard}>
              <span className={styles.serviceIcon}>{s.icon}</span>
              <h3 className={styles.serviceTitle}>{s.title}</h3>
              <p className={styles.serviceDesc}>{s.desc}</p>
              <p className={styles.servicePrice}>{s.price}</p>
              <Link to="/servicos" className={styles.serviceLink}>Saiba Mais →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Before/After teaser */}
      <section className={styles.teaserSection}>
        <div className={styles.teaserContent}>
          <p className={styles.eyebrow}>Transformações Reais</p>
          <h2 className={styles.teaserTitle}>Os Resultados Falam por Si</h2>
          <p className={styles.teaserText}>
            Veja as transformações incríveis que meus tratamentos proporcionam. Cada resultado é único e personalizado para cada tipo de cabelo.
          </p>
          <BookingButton label="Ver Antes & Depois" to="/antes-depois" variant="outline" />
        </div>
        <div className={styles.teaserVisual}>
          <div className={styles.beforeAfterBox}>
            <div className={styles.beforeLabel}>Antes</div>
            <div className={styles.afterLabel}>Depois</div>
          </div>
        </div>
      </section>

      {/* Experience highlight */}
      <section className={styles.expSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Mais que um serviço</p>
          <h2 className={styles.sectionTitle}>Uma Experiência Completa</h2>
          <p className={styles.sectionSub}>Cada detalhe pensado para o seu conforto e bem-estar enquanto se transforma.</p>
        </div>
        <div className={styles.amenities}>
          {['☕ Premium Coffee', '🍫 Brazilian Snacks', '💆 Massage Cushion', '🌸 Relaxing Aroma',
            '📶 Free Wi-Fi', '🔋 Phone Charging', '💧 Sparkling Water', '📖 Magazines'].map(a => (
            <div key={a} className={styles.amenity}>{a}</div>
          ))}
        </div>
        <div className={styles.expCta}>
          <Link to="/experiencia" className={styles.heroSecondary}>Conhecer a Experiência →</Link>
        </div>
      </section>

      {/* Reviews */}
      <section className={styles.reviewsSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>O que dizem</p>
          <h2 className={styles.sectionTitle}>Avaliações dos Clientes</h2>
          <div className={styles.ratingBadge}>
            <span className={styles.ratingStars}>★★★★★</span>
            <span className={styles.ratingText}>5.0 · Google Reviews</span>
          </div>
        </div>
        <div className={styles.reviewsGrid}>
          {reviews.map(r => (
            <div key={r.name} className={styles.reviewCard}>
              <div className={styles.reviewStars}>{'★'.repeat(r.stars)}</div>
              <p className={styles.reviewText}>"{r.text}"</p>
              <p className={styles.reviewName}>{r.name}</p>
            </div>
          ))}
        </div>
        <div className={styles.expCta}>
          <Link to="/avaliacoes" className={styles.heroSecondary}>Ver Todas as Avaliações →</Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Pronta para a Transformação?</h2>
        <p className={styles.ctaText}>Agende sua consulta e descubra o tratamento ideal para o seu cabelo.</p>
        <BookingButton label="Agendar Minha Consulta" variant="primary" />
      </section>
    </div>
  )
}
