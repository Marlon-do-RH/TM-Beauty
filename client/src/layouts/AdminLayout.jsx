import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import styles from './AdminLayout.module.css'
import {
  IconGrid, IconCalendar, IconScissors, IconImage,
  IconCamera, IconHelpCircle, IconMapPin, IconLogOut, IconStar,
} from '../components/AdminIcons'

const navGroups = [
  {
    label: 'Gestão',
    items: [
      { to: '/admin', label: 'Dashboard', Icon: IconGrid, end: true },
      { to: '/admin/appointments', label: 'Agendamentos', Icon: IconCalendar },
    ],
  },
  {
    label: 'Conteúdo',
    items: [
      { to: '/admin/services', label: 'Serviços & Preços', Icon: IconScissors },
      { to: '/admin/gallery', label: 'Galeria', Icon: IconImage },
      { to: '/admin/media', label: 'Fotos do Site', Icon: IconCamera },
      { to: '/admin/faq', label: 'FAQ', Icon: IconHelpCircle },
      { to: '/admin/reviews', label: 'Avaliações', Icon: IconStar },
    ],
  },
  {
    label: 'Configurações',
    items: [
      { to: '/admin/contact-info', label: 'Informações de Contato', Icon: IconMapPin },
    ],
  },
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
          {navGroups.map(group => (
            <div key={group.label} className={styles.navGroup}>
              <p className={styles.navGroupLabel}>{group.label}</p>
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                  }
                >
                  <span className={styles.navIcon}>
                    <item.Icon size={15} />
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <IconLogOut size={14} />
          Sair
        </button>
      </aside>

      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  )
}
