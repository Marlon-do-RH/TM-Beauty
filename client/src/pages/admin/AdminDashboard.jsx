import { Link } from 'react-router-dom'
import styles from './Admin.module.css'
import { IconCalendar, IconAlertCircle, IconCheck, IconStar, IconScissors, IconImage, IconHelpCircle, IconChevronRight } from '../../components/AdminIcons'

const stats = [
  { label: 'Appointments this week', value: '12', Icon: IconCalendar, color: '#6B4E3D', bg: '#F2EBE3' },
  { label: 'Pending confirmation', value: '4', Icon: IconAlertCircle, color: '#C0862E', bg: '#FEF3E2' },
  { label: 'Completed this month', value: '38', Icon: IconCheck, color: '#287A5B', bg: '#EAF5EF' },
  { label: 'New clients', value: '7', Icon: IconStar, color: '#7B5EA7', bg: '#F3EEFB' },
]

const recentAppts = [
  { name: 'Sarah M.', service: 'Brazilian Nanoplastia', date: '2024-06-03', time: '10:00', status: 'confirmed' },
  { name: 'Camila R.', service: 'Brazilian Botox', date: '2024-06-03', time: '13:30', status: 'pending' },
  { name: 'Jessica T.', service: 'Deep Treatment', date: '2024-06-04', time: '11:00', status: 'confirmed' },
  { name: 'Ana P.', service: 'Brazilian Nanoplastia', date: '2024-06-05', time: '09:30', status: 'pending' },
]

const statusColors = {
  pending:   { bg: '#FEF3E2', color: '#C0862E', label: 'Pending' },
  confirmed: { bg: '#EAF5EF', color: '#287A5B', label: 'Confirmed' },
  completed: { bg: '#EAF3FF', color: '#2563EB', label: 'Completed' },
  cancelled: { bg: '#FEF2F2', color: '#C0392B', label: 'Cancelled' },
}

export default function AdminDashboard() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome back, Thalita.</p>
        </div>
        <Link to="/admin/appointments" className={styles.primaryBtn}>
          New Appointment
        </Link>
      </div>

      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statIconBox} style={{ background: s.bg, color: s.color }}>
              <s.Icon size={18} />
            </div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.sectionTitle}>Recent Appointments</div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentAppts.map((a, i) => {
              const st = statusColors[a.status]
              return (
                <tr key={i}>
                  <td className={styles.tdName}>{a.name}</td>
                  <td>{a.service}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>
                    <span className={styles.badge} style={{ background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.quickLinks}>
        <Link to="/admin/appointments" className={styles.quickLink}>
          <IconCalendar size={15} /> View all appointments <IconChevronRight size={14} />
        </Link>
        <Link to="/admin/services" className={styles.quickLink}>
          <IconScissors size={15} /> Manage services <IconChevronRight size={14} />
        </Link>
        <Link to="/admin/gallery" className={styles.quickLink}>
          <IconImage size={15} /> Update gallery <IconChevronRight size={14} />
        </Link>
        <Link to="/admin/faq" className={styles.quickLink}>
          <IconHelpCircle size={15} /> Edit FAQ <IconChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}
