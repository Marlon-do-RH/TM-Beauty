import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoTm}>TM</span>
          </div>
          <p className={styles.tagline}>Thalita Medeiros</p>
          <p className={styles.sub}>Brazilian Hair Specialist in Melbourne</p>
          <p className={styles.copy}>© {new Date().getFullYear()} Thalita Medeiros. Todos os direitos reservados.</p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Navegação</h4>
          <ul className={styles.colLinks}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/sobre">Sobre Thalita</Link></li>
            <li><Link to="/servicos">Serviços</Link></li>
            <li><Link to="/antes-depois">Antes & Depois</Link></li>
            <li><Link to="/experiencia">A Experiência</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Mais</h4>
          <ul className={styles.colLinks}>
            <li><Link to="/studio">O Studio</Link></li>
            <li><Link to="/produtos">Produtos</Link></li>
            <li><Link to="/avaliacoes">Avaliações</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contato">Contato</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Conecte-se</h4>
          <ul className={styles.colLinks}>
            <li>
              <a href="https://instagram.com/thalita.medeiros.hair" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://wa.me/61400123456" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li><Link to="/contato">Email</Link></li>
          </ul>
          <div className={styles.newsletter}>
            <p className={styles.newsletterTitle}>Newsletter</p>
            <p className={styles.newsletterSub}>Receba dicas e novidades exclusivas.</p>
            <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Seu e-mail" className={styles.newsletterInput} />
              <button type="submit" className={styles.newsletterBtn}>→</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  )
}
