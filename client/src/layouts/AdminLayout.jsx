import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import styles from './AdminLayout.module.css'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '⊞', end: true },
  { to: '/admin/appointments', label: 'Agendamentos', icon: '📅' },
  { to: '/admin/services', label: 'Serviços', icon: '✂' },
  { to: '/admin/gallery', label: 'Galeria', icon: '🖼' },
  { to: '/admin/faq', label: 'FAQ', icon: '?' },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('tm_token')
    navigate('/admin/login')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.brandMark}>TM</span>
          <div>
            <p className={styles.brandTitle}>Admin</p>
            <p className={styles.brandSub}>TM Beauty</p>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          ← Sair
        </button>
      </aside>

      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  )
}
