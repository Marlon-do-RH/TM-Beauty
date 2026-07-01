import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'
import s from './AExperiencia.module.css'

const amenities = [
  { icon: '☕', title: 'Premium Coffee', desc: 'Café especial selecionado para acompanhar seu tratamento.' },
  { icon: '🍫', title: 'Brazilian Snacks', desc: 'Petiscos brasileiros tradicionais para sentir-se em casa.' },
  { icon: '💆', title: 'Massage Cushion', desc: 'Almofada de massagem para máximo conforto durante o serviço.' },
  { icon: '🌸', title: 'Relaxing Aroma', desc: 'Aromaterapia cuidadosamente escolhida para criar um ambiente tranquilo.' },
  { icon: '📶', title: 'Free Wi-Fi', desc: 'Internet de alta velocidade para trabalhar ou relaxar.' },
  { icon: '🔋', title: 'Phone Charging', desc: 'Carregadores disponíveis para todos os modelos de smartphone.' },
  { icon: '💧', title: 'Sparkling Water', desc: 'Água mineral com e sem gás disponível durante toda a sessão.' },
  { icon: '📖', title: 'Magazines', desc: 'Seleção de revistas de moda, lifestyle e beleza.' },
]

const steps = [
  { num: '01', title: 'Consulta Inicial', desc: 'Avaliamos o seu cabelo, conversamos sobre o seu histórico e definimos juntas o tratamento ideal.' },
  { num: '02', title: 'Diagnóstico Capilar', desc: 'Análise completa da estrutura e necessidades do seu cabelo para uma abordagem personalizada.' },
  { num: '03', title: 'O Tratamento', desc: 'Você relaxa e aproveita os mimos do studio enquanto seu cabelo é transformado.' },
  { num: '04', title: 'Finalização e Cuidados', desc: 'Acabamento impecável e orientações personalizadas para prolongar o resultado em casa.' },
]

export default function AExperiencia() {
  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>Mais que beleza</p>
          <h1 className={styles.pageTitle}>A Experiência</h1>
          <p className={styles.pageSubtitle}>Cada detalhe pensado para que você se sinta especial do início ao fim.</p>
        </div>
      </section>

      <section className={s.introSection}>
        <div className={s.inner}>
          <div className={s.introGrid}>
            <div>
              <p className={styles.eyebrow}>Nossa filosofia</p>
              <h2 className={styles.sectionTitle}>Uma visita ao studio é uma pausa luxuosa no seu dia</h2>
              <p className={s.introText}>
                Quando você chega ao meu studio, não está apenas fazendo um tratamento capilar — está investindo em si mesma. Cada detalhe foi pensado para que a sua experiência seja tão incrível quanto o resultado.
              </p>
              <p className={s.introText}>
                Do café especial à poltrona ergonômica, do aroma relaxante à conversa acolhedora — aqui, você é prioridade.
              </p>
            </div>
            <div className={s.introVisual}>
              <div className={s.introPlaceholder} />
            </div>
          </div>
        </div>
      </section>

      <section className={s.amenitiesSection}>
        <div className={s.inner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Incluído em todos os serviços</p>
            <h2 className={styles.sectionTitle}>Os Mimos do Studio</h2>
          </div>
          <div className={s.amenitiesGrid}>
            {amenities.map(a => (
              <div key={a.title} className={s.amenityCard}>
                <span className={s.amenityIcon}>{a.icon}</span>
                <h3 className={s.amenityTitle}>{a.title}</h3>
                <p className={s.amenityDesc}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.stepsSection}>
        <div className={s.inner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Como funciona</p>
            <h2 className={styles.sectionTitle}>Sua Jornada de Transformação</h2>
          </div>
          <div className={s.stepsGrid}>
            {steps.map(st => (
              <div key={st.num} className={s.stepCard}>
                <span className={s.stepNum}>{st.num}</span>
                <h3 className={s.stepTitle}>{st.title}</h3>
                <p className={s.stepDesc}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Pronta para vivenciar?</h2>
        <p className={styles.ctaText}>Reserve seu horário e venha descobrir por que minhas clientes nunca vão a outro lugar.</p>
        <BookingButton label="Agendar Minha Experiência" variant="primary" />
      </section>
    </div>
  )
}
