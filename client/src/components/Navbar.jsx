import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useAdminAuth } from '../context/AdminAuth'
import AdminLoginModal from './AdminLoginModal'
import AdminChip from './AdminChip'
import { IconLock } from './AdminIcons'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { t } = useLanguage()
  const { isAdmin, logout } = useAdminAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [chipOpen, setChipOpen] = useState(false)
  const [origin, setOrigin] = useState({ x: 90, y: 6 })
  const lockRef = useRef(null)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: t('nav', 'home') },
    { to: '/sobre', label: t('nav', 'sobre') },
    { to: '/servicos', label: t('nav', 'servicos') },
    { to: '/antes-depois', label: t('nav', 'antesDepois') },
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
    setChipOpen(false)
  }, [location.pathname])

  const originFromLock = () => {
    const el = lockRef.current
    if (!el) return { x: 90, y: 6 }
    const r = el.getBoundingClientRect()
    return {
      x: ((r.left + r.width / 2) / window.innerWidth) * 100,
      y: ((r.top + r.height / 2) / window.innerHeight) * 100,
    }
  }

  const onLockClick = () => {
    if (isAdmin) {
      setChipOpen(v => !v)
      return
    }
    setOrigin(originFromLock())
    setLoginOpen(true)
  }

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
          <Link to="/agendar" className={styles.bookBtn}>
            {t('nav', 'bookNow')}
          </Link>

          <div className={styles.adminWrap}>
            <button
              ref={lockRef}
              type="button"
              className={`${styles.adminBtn} ${isAdmin ? styles.adminBtnOn : ''}`}
              title={isAdmin ? 'Admin tools' : t('nav', 'adminLogin')}
              aria-label={isAdmin ? 'Admin tools' : 'Admin login'}
              aria-expanded={isAdmin ? chipOpen : loginOpen}
              onClick={onLockClick}
            >
              <IconLock size={14} />
            </button>
            {isAdmin && chipOpen && (
              <AdminChip
                onClose={() => setChipOpen(false)}
                onLogout={() => {
                  logout()
                  setChipOpen(false)
                }}
              />
            )}
          </div>
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

      {loginOpen && !isAdmin && (
        <AdminLoginModal origin={origin} onClose={() => setLoginOpen(false)} />
      )}
    </nav>
  )
}
