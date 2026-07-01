import styles from './PageCommon.module.css'
import s from './Avaliacoes.module.css'

const reviews = [
  { name: 'Sarah M.', date: 'January 2024', stars: 5, text: 'Absolutely amazing! My hair has never felt this smooth and shiny. Thalita is a true artist — so professional, caring, and knowledgeable. The studio is beautiful and the whole experience felt like a luxury spa day. I will definitely be coming back!' },
  { name: 'Camila R.', date: 'February 2024', stars: 5, text: "Incredible experience from start to finish. Thalita really listens to what you want and the results are beyond what I expected. The studio is so comfortable and welcoming. I've recommended her to all my friends." },
  { name: 'Jessica T.', date: 'March 2024', stars: 5, text: "I've been going to Thalita for 2 years and I will never go anywhere else. The best hair treatment in Melbourne! She's consistently amazing and my hair always looks and feels incredible after every visit." },
  { name: 'Ana P.', date: 'March 2024', stars: 5, text: "The Nanoplastia treatment was life-changing. My hair used to take 45 minutes to style — now it's perfect in 10 minutes. Thalita is an expert and the studio experience is second to none." },
  { name: 'Michelle K.', date: 'April 2024', stars: 5, text: "From the moment I walked in, I felt so welcome. The attention to detail is incredible — from the coffee to the massage cushion. And the results? My hair looks like I'm in a shampoo commercial!" },
  { name: 'Larissa O.', date: 'May 2024', stars: 5, text: 'Thalita is so talented and genuinely passionate about her work. She took the time to understand my hair type and recommended the perfect treatment. I left the studio feeling like a new person.' },
]

const igReviews = [
  { handle: '@sarah_m', comment: 'Just left @thalita.medeiros.hair and WOW. My hair is absolutely transformed 🙌✨ 5 stars doesn\'t even cover it!' },
  { handle: '@camila_rbx', comment: 'Best decision I ever made booking with Thalita! The Brazilian Botox is unreal 😍 Book her now before she\'s fully booked!' },
  { handle: '@jess_style_mel', comment: 'Couldn\'t be happier with my Nanoplastia results! @thalita.medeiros.hair is worth every cent. Running hair that behaves??? Yes please 💆‍♀️' },
]

export default function Avaliacoes() {
  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>O que dizem</p>
          <h1 className={styles.pageTitle}>Avaliações</h1>
          <p className={styles.pageSubtitle}>Mais de 1000 clientes transformadas em Melbourne e no mundo.</p>
        </div>
      </section>

      <section className={s.ratingHero}>
        <div className={s.inner}>
          <div className={s.ratingBig}>
            <span className={s.ratingNum}>5.0</span>
            <div>
              <div className={s.ratingStars}>★★★★★</div>
              <p className={s.ratingLabel}>Nota média no Google Reviews</p>
              <a
                href="https://g.page/r/thalita-medeiros"
                target="_blank"
                rel="noreferrer"
                className={s.ratingLink}
              >
                Ver no Google →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={s.reviewsSection}>
        <div className={s.inner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Google Reviews</p>
            <h2 className={styles.sectionTitle}>O Que as Clientes Dizem</h2>
          </div>
          <div className={s.reviewsGrid}>
            {reviews.map(r => (
              <div key={r.name} className={s.reviewCard}>
                <div className={s.reviewTop}>
                  <div className={s.avatar}>{r.name[0]}</div>
                  <div>
                    <p className={s.reviewName}>{r.name}</p>
                    <p className={s.reviewDate}>{r.date}</p>
                  </div>
                  <div className={s.reviewStars}>{'★'.repeat(r.stars)}</div>
                </div>
                <p className={s.reviewText}>"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.igSection}>
        <div className={s.inner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Instagram</p>
            <h2 className={styles.sectionTitle}>Avaliações nas Redes Sociais</h2>
          </div>
          <div className={s.igGrid}>
            {igReviews.map(r => (
              <div key={r.handle} className={s.igCard}>
                <div className={s.igHeader}>
                  <div className={s.igAvatar}>📸</div>
                  <span className={s.igHandle}>{r.handle}</span>
                </div>
                <p className={s.igComment}>{r.comment}</p>
              </div>
            ))}
          </div>
          <div className={s.igCta}>
            <a
              href="https://instagram.com/thalita.medeiros.hair"
              target="_blank"
              rel="noreferrer"
              className={s.igLink}
            >
              @thalita.medeiros.hair →
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
