import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useSession } from '../context/AdminAuth'
import AdminLoginModal from './AdminLoginModal'
import AdminChip from './AdminChip'
import { IconLock } from './AdminIcons'
import BrandMark from './BrandMark'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { t } = useLanguage()
  const { isAdmin, logout, loginRequested, clearLoginRequest } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [chipOpen, setChipOpen] = useState(false)
  const lockRef = useRef(null)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: t('nav', 'home') },
    { to: '/aboutus', label: t('nav', 'sobre') },
    { to: '/services', label: t('nav', 'servicos') },
    { to: '/before-after', label: t('nav', 'antesDepois') },
    { to: '/reviews', label: t('nav', 'avaliacoes') },
    { to: '/faq', label: t('nav', 'faq') },
    { to: '/contact', label: t('nav', 'contato') },
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

  useEffect(() => {
    if (loginRequested && !isAdmin) {
      setLoginOpen(true)
      clearLoginRequest()
    }
  }, [loginRequested, isAdmin, clearLoginRequest])

  const onAccountClick = () => {
    if (isAdmin) {
      setChipOpen(v => !v)
      return
    }
    setLoginOpen(true)
  }

  return (
    <>
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <BrandMark size={36} className={styles.brandMark} />
          <span className={styles.brandName}>Nanoplasty by Thalita</span>
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
          <Link to="/booking" className={styles.bookBtn}>
            {t('nav', 'bookNow')}
          </Link>

          <div className={styles.adminWrap}>
            <button
              ref={lockRef}
              type="button"
              className={`${styles.adminBtn} ${isAdmin ? styles.adminBtnOn : ''}`}
              title={isAdmin ? 'Admin tools' : 'Staff log in'}
              aria-label={isAdmin ? 'Admin tools' : 'Staff log in'}
              aria-expanded={isAdmin ? chipOpen : loginOpen}
              onClick={onAccountClick}
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

    </nav>
      {loginOpen && !isAdmin && (
        <AdminLoginModal onClose={() => setLoginOpen(false)} />
      )}
    </>
  )
}
