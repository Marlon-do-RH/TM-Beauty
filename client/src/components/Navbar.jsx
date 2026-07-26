import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { t, lang, switchLang, LANGS } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const location = useLocation()
  const langRef = useRef(null)

  const navLinks = [
    { to: '/', label: t('nav', 'home') },
    { to: '/sobre', label: t('nav', 'sobre') },
    { to: '/servicos', label: t('nav', 'servicos') },
    { to: '/antes-depois', label: t('nav', 'antesDepois') },
    { to: '/studio', label: t('nav', 'studio') },
    { to: '/avaliacoes', label: t('nav', 'avaliacoes') },
    { to: '/faq', label: t('nav', 'faq') },
    { to: '/contato', label: t('nav', 'contato') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setLangOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClick = e => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const currentLang = LANGS.find(l => l.code === lang)

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandTm}>TM</span>
          <span className={styles.brandName}>Thalita Medeiros</span>
        </Link>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {navLinks.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`${styles.link} ${location.pathname === l.to ? styles.active : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {/* Language switcher */}
          <div className={styles.langWrapper} ref={langRef}>
            <button
              className={styles.langBtn}
              onClick={() => setLangOpen(v => !v)}
              aria-label="Select language"
              title="Select language"
            >
              <span className={styles.langFlag}>{currentLang?.flag}</span>
              <span className={styles.langCode}>{lang.toUpperCase()}</span>
              <span className={`${styles.langChevron} ${langOpen ? styles.langChevronOpen : ''}`}>▾</span>
            </button>

            {langOpen && (
              <div className={styles.langDropdown}>
                {LANGS.map(l => (
                  <button
                    key={l.code}
                    className={`${styles.langOption} ${lang === l.code ? styles.langOptionActive : ''}`}
                    onClick={() => { switchLang(l.code); setLangOpen(false) }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                    {lang === l.code && <span className={styles.langCheck}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Book Now */}
          <Link to="/agendar" className={styles.bookBtn}>
            {t('nav', 'bookNow')}
          </Link>

          {/* Admin login — subtle lock icon */}
          <Link
            to="/admin/login"
            className={styles.adminBtn}
            title={t('nav', 'adminLogin')}
            aria-label="Admin login"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </Link>
        </div>

        <button
          className={styles.burger}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? styles.barOpen : ''} />
          <span className={menuOpen ? styles.barOpen : ''} />
          <span className={menuOpen ? styles.barOpen : ''} />
        </button>
      </div>
    </nav>
  )
}
