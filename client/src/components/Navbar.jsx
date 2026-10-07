import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useSession } from '../context/AdminAuth'
import AdminLoginModal from './AdminLoginModal'
import AdminChip from './AdminChip'
import { IconLock, IconUser } from './AdminIcons'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { t } = useLanguage()
  const { isAdmin, isCustomer, logout, loginRequested, clearLoginRequest } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [chipOpen, setChipOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
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
    setAccountOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (loginRequested && !isAdmin && !isCustomer) {
      setOrigin(originFromLock())
      setLoginOpen(true)
      clearLoginRequest()
    }
  }, [loginRequested, isAdmin, isCustomer, clearLoginRequest])

  const originFromLock = () => {
    const el = lockRef.current
    if (!el) return { x: 90, y: 6 }
    const r = el.getBoundingClientRect()
    return {
      x: ((r.left + r.width / 2) / window.innerWidth) * 100,
      y: ((r.top + r.height / 2) / window.innerHeight) * 100,
    }
  }

  const onAccountClick = () => {
    if (isAdmin) {
      setChipOpen(v => !v)
      return
    }
    if (isCustomer) {
      setAccountOpen(v => !v)
      return
    }
    setOrigin(originFromLock())
    setLoginOpen(true)
  }

  const signedIn = isAdmin || isCustomer

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
              className={`${styles.adminBtn} ${signedIn ? styles.adminBtnOn : ''}`}
              title={isAdmin ? 'Admin tools' : isCustomer ? 'Your account' : 'Log in'}
              aria-label={isAdmin ? 'Admin tools' : isCustomer ? 'Your account' : 'Log in'}
              aria-expanded={isAdmin ? chipOpen : isCustomer ? accountOpen : loginOpen}
              onClick={onAccountClick}
            >
              {isCustomer ? <IconUser size={14} /> : <IconLock size={14} />}
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
            {isCustomer && accountOpen && (
              <div className={styles.accountMenu} role="menu">
                <Link to="/profile" className={styles.accountItem} onClick={() => setAccountOpen(false)}>
                  Profile
                </Link>
                <button
                  type="button"
                  className={styles.accountItem}
                  onClick={() => {
                    logout()
                    setAccountOpen(false)
                  }}
                >
                  Log out
                </button>
              </div>
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

      {loginOpen && !signedIn && (
        <AdminLoginModal origin={origin} onClose={() => setLoginOpen(false)} />
      )}
    </nav>
  )
}
