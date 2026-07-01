import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useLanguage()

  const navLinks = [
    { to: '/', label: t('nav', 'home') },
    { to: '/sobre', label: t('nav', 'sobre') },
    { to: '/servicos', label: t('nav', 'servicos') },
    { to: '/antes-depois', label: t('nav', 'antesDepois') },
    { to: '/experiencia', label: t('nav', 'experiencia') },
  ]

  const moreLinks = [
    { to: '/studio', label: t('nav', 'studio') },
    { to: '/produtos', label: t('nav', 'produtos') },
    { to: '/avaliacoes', label: t('nav', 'avaliacoes') },
    { to: '/faq', label: t('nav', 'faq') },
    { to: '/contato', label: t('nav', 'contato') },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoTm}>TM</span>
          </div>
          <p className={styles.tagline}>{t('footer', 'tagline')}</p>
          <p className={styles.sub}>{t('footer', 'sub')}</p>
          <p className={styles.copy}>© {new Date().getFullYear()} Thalita Medeiros. {t('footer', 'copy')}</p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('footer', 'nav')}</h4>
          <ul className={styles.colLinks}>
            {navLinks.map(l => (
              <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('footer', 'more')}</h4>
          <ul className={styles.colLinks}>
            {moreLinks.map(l => (
              <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('footer', 'connect')}</h4>
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
            <p className={styles.newsletterTitle}>{t('footer', 'newsletter')}</p>
            <p className={styles.newsletterSub}>{t('footer', 'newsletterSub')}</p>
            <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder={t('footer', 'newsletterPlaceholder')} className={styles.newsletterInput} />
              <button type="submit" className={styles.newsletterBtn}>→</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  )
}
