import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'
import s from './Servicos.module.css'

const services = [
  {
    id: 'nano',
    name: 'Brazilian Nanoplastia',
    tagline: 'O alisamento do futuro, hoje.',
    price: 'A partir de R$ 280',
    duration: '3–4 horas',
    desc: 'A Nanoplastia Brasileira é o tratamento mais avançado de alisamento sem formol. Utilizando nanopartículas que penetram na estrutura capilar, promove fios lisos, sedosos e com brilho intenso — sem agredir a saúde do cabelo.',
    benefits: ['Sem formol', 'Resultado até 8 meses', 'Cabelos lisos ou levemente ondulados', 'Pode ser feito em cabelos tingidos'],
    icon: '✦',
  },
  {
    id: 'botox',
    name: 'Brazilian Botox',
    tagline: 'Hidratação e volume sob controle.',
    price: 'A partir de R$ 220',
    duration: '2–3 horas',
    desc: 'O Botox Capilar Brasileiro é o tratamento ideal para quem quer reduzir o volume, eliminar o frizz e restaurar a hidratação dos fios. Com resultado natural e progressivo, dura até 4 meses.',
    benefits: ['Reduz volume e frizz', 'Resultado até 4 meses', 'Hidratação profunda', 'Ideal para cabelos com dano médio'],
    icon: '✧',
  },
  {
    id: 'deep',
    name: 'Deep Treatment',
    tagline: 'Reconstrução e vida para os seus fios.',
    price: 'A partir de R$ 180',
    duration: '1–2 horas',
    desc: 'O Deep Treatment é um tratamento reconstrutivo intensivo que devolve força, brilho e elasticidade aos cabelos danificados pelo calor, coloração ou processos químicos.',
    benefits: ['Reconstrói a fibra capilar', 'Elimina pontas duplas visualmente', 'Aumenta o brilho em até 80%', 'Indicado para qualquer tipo de cabelo'],
    icon: '◈',
  },
]

export default function Servicos() {
  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>O que ofereço</p>
          <h1 className={styles.pageTitle}>Serviços</h1>
          <p className={styles.pageSubtitle}>Tratamentos capilares brasileiros de alta performance, personalizados para cada tipo de cabelo.</p>
        </div>
      </section>

      <section className={s.servicesSection}>
        <div className={s.inner}>
          {services.map((sv, i) => (
            <div key={sv.id} className={`${s.serviceRow} ${i % 2 !== 0 ? s.serviceRowReverse : ''}`}>
              <div className={s.serviceVisual}>
                <div className={s.servicePlaceholder}>
                  <span className={s.servicePlaceholderIcon}>{sv.icon}</span>
                </div>
              </div>
              <div className={s.serviceContent}>
                <p className={styles.eyebrow}>Tratamento</p>
                <h2 className={s.serviceName}>{sv.name}</h2>
                <p className={s.serviceTagline}>{sv.tagline}</p>
                <p className={s.serviceDesc}>{sv.desc}</p>
                <ul className={s.benefits}>
                  {sv.benefits.map(b => (
                    <li key={b} className={s.benefit}>
                      <span className={s.benefitDot}>✓</span> {b}
                    </li>
                  ))}
                </ul>
                <div className={s.serviceMeta}>
                  <span className={s.servicePrice}>{sv.price}</span>
                  <span className={s.serviceDuration}>⏱ {sv.duration}</span>
                </div>
                <BookingButton label="Agendar Este Serviço" variant="primary" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Não tem certeza qual tratamento é o ideal?</h2>
        <p className={styles.ctaText}>Entre em contato para uma consulta gratuita e descobrirei o melhor para o seu cabelo.</p>
        <BookingButton label="Consulta Gratuita" variant="primary" to="/contato" />
      </section>
    </div>
  )
}
