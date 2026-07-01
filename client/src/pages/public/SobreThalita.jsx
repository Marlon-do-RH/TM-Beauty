import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'

const values = [
  { icon: '✦', title: 'Excelência', desc: 'Cada tratamento é executado com a mais alta precisão e cuidado técnico.' },
  { icon: '♡', title: 'Autenticidade', desc: 'Técnicas 100% brasileiras, adaptadas ao clima e necessidades locais.' },
  { icon: '◈', title: 'Personalização', desc: 'Cada cabelo é único. Cada tratamento é pensado para você.' },
  { icon: '✧', title: 'Bem-estar', desc: 'Mais do que beleza — uma experiência de autocuidado completa.' },
]

export default function SobreThalita() {
  return (
    <div>
      {/* Hero */}
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>A Especialista</p>
          <h1 className={styles.pageTitle}>Sobre Thalita</h1>
          <p className={styles.pageSubtitle}>Da cidade de São Paulo para o coração de Melbourne — uma jornada de paixão e dedicação.</p>
        </div>
      </section>

      {/* Bio */}
      <section className={styles.bioSection}>
        <div className={styles.bioGrid}>
          <div className={styles.bioVisual}>
            <div className={styles.bioImgPlaceholder}>
              <div className={styles.bioImgBadge}>
                <span>Thalita Medeiros</span>
                <span className={styles.bioImgSub}>Brazilian Hair Specialist</span>
              </div>
            </div>
          </div>
          <div className={styles.bioContent}>
            <p className={styles.eyebrow}>Minha História</p>
            <h2 className={styles.sectionTitle}>Da Arte à Ciência dos Cabelos</h2>
            <p className={styles.bioText}>
              Natural de São Paulo, comecei minha jornada no mundo da beleza ainda jovem, fascinada pela arte de transformar cabelos e elevar a autoestima das pessoas. Com mais de 10 anos de experiência, me especializei nas técnicas capilares mais avançadas do Brasil.
            </p>
            <p className={styles.bioText}>
              Minha trajetória me levou por três continentes — do Brasil à França, onde aprofundei meus conhecimentos em técnicas europeias, até chegar à Austrália, onde encontrei meu lar e minha comunidade de clientes apaixonadas.
            </p>
            <p className={styles.bioText}>
              Em Melbourne, criei o meu studio como um espaço de transformação real: onde a ciência capilar brasileira encontra o conforto e a exclusividade que cada cliente merece.
            </p>
            <div className={styles.bioTimeline}>
              <div className={styles.bioTimelineItem}>
                <span className={styles.bioTimelineYear}>Brasil</span>
                <span className={styles.bioTimelineDesc}>Início da carreira e especialização em técnicas brasileiras</span>
              </div>
              <div className={styles.bioTimelineItem}>
                <span className={styles.bioTimelineYear}>França</span>
                <span className={styles.bioTimelineDesc}>Aperfeiçoamento em técnicas europeias de tratamento</span>
              </div>
              <div className={styles.bioTimelineItem}>
                <span className={styles.bioTimelineYear}>Melbourne</span>
                <span className={styles.bioTimelineDesc}>Abertura do studio e mais de 1000 clientes transformadas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>O que me guia</p>
            <h2 className={styles.sectionTitle}>Meus Valores</h2>
          </div>
          <div className={styles.valuesGrid}>
            {values.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Vamos nos Conhecer?</h2>
        <p className={styles.ctaText}>Agende sua consulta e venha descobrir o tratamento perfeito para o seu cabelo.</p>
        <BookingButton label="Agendar Consulta" variant="primary" />
      </section>
    </div>
  )
}
