import BookingButton from '../../components/BookingButton'
import styles from './PageCommon.module.css'
import s from './OStudio.module.css'

const photos = [
  { size: 'large', caption: 'Área de tratamento principal' },
  { size: 'small', caption: 'Estação de lavagem' },
  { size: 'small', caption: 'Área de espera' },
  { size: 'small', caption: 'Produtos selecionados' },
  { size: 'small', caption: 'Detalhes do espaço' },
  { size: 'large', caption: 'O ambiente completo' },
]

export default function OStudio() {
  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>O nosso espaço</p>
          <h1 className={styles.pageTitle}>O Studio</h1>
          <p className={styles.pageSubtitle}>Um espaço criado para que você se sinta em casa enquanto se transforma.</p>
        </div>
      </section>

      <section className={s.introSection}>
        <div className={s.inner}>
          <div className={s.introText}>
            <p className={styles.eyebrow}>Melbourne · Australia</p>
            <h2 className={styles.sectionTitle}>Um refúgio de beleza e bem-estar</h2>
            <p className={s.text}>
              O meu studio foi projetado para ser mais do que um salão de beleza. É um espaço íntimo e exclusivo onde você é recebida com atenção personalizada, ambiente tranquilo e todos os detalhes pensados para o seu conforto.
            </p>
            <p className={s.text}>
              Localizado em Melbourne, o studio combina estética contemporânea com elementos brasileiros, criando um ambiente único que reflete minha trajetória e paixão.
            </p>
          </div>
        </div>
      </section>

      <section className={s.gallerySection}>
        <div className={s.inner}>
          <div className={s.galleryGrid}>
            {photos.map((p, i) => (
              <div key={i} className={`${s.photoCard} ${p.size === 'large' ? s.photoCardLarge : ''}`}>
                <div className={s.photoPlaceholder} />
                <p className={s.photoCaption}>{p.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.locationSection}>
        <div className={s.inner}>
          <div className={s.locationGrid}>
            <div>
              <p className={styles.eyebrow}>Onde nos encontrar</p>
              <h2 className={styles.sectionTitle}>Localização</h2>
              <p className={s.text}>Melbourne, Victoria, Australia</p>
              <div className={s.locationDetails}>
                <p>📍 Melbourne, VIC, Australia</p>
                <p>📞 +61 400 000 000</p>
                <p>📧 hello@thalitamedeiros.com.au</p>
                <p>⏰ Seg–Sáb: 9h às 18h</p>
              </div>
              <BookingButton label="Como Chegar" to="/contato" variant="outline" />
            </div>
            <div className={s.mapPlaceholder}>
              <div className={s.mapInner}>
                <span>📍 Melbourne, Australia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Venha nos conhecer pessoalmente</h2>
        <p className={styles.ctaText}>Agende sua visita e sinta a diferença de um atendimento realmente personalizado.</p>
        <BookingButton label="Agendar Visita" variant="primary" />
      </section>
    </div>
  )
}
