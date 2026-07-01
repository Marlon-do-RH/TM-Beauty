import { Link } from 'react-router-dom'
import styles from './Admin.module.css'

const stats = [
  { label: 'Agendamentos esta semana', value: '12', icon: '📅', color: '#C9A84C' },
  { label: 'Pendentes de confirmação', value: '4', icon: '⏳', color: '#e67e22' },
  { label: 'Concluídos este mês', value: '38', icon: '✓', color: '#27ae60' },
  { label: 'Clientes novos', value: '7', icon: '⭐', color: '#9b59b6' },
]

const recentAppts = [
  { name: 'Sarah M.', service: 'Brazilian Nanoplastia', date: '2024-06-03', time: '10:00', status: 'confirmed' },
  { name: 'Camila R.', service: 'Brazilian Botox', date: '2024-06-03', time: '13:30', status: 'pending' },
  { name: 'Jessica T.', service: 'Deep Treatment', date: '2024-06-04', time: '11:00', status: 'confirmed' },
  { name: 'Ana P.', service: 'Brazilian Nanoplastia', date: '2024-06-05', time: '09:30', status: 'pending' },
]

const statusColors = {
  pending: { bg: 'rgba(230,126,34,0.12)', color: '#e67e22', label: 'Pendente' },
  confirmed: { bg: 'rgba(39,174,96,0.12)', color: '#27ae60', label: 'Confirmado' },
  completed: { bg: 'rgba(52,152,219,0.12)', color: '#3498db', label: 'Concluído' },
  cancelled: { bg: 'rgba(231,76,60,0.12)', color: '#e74c3c', label: 'Cancelado' },
}

export default function AdminDashboard() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Bem-vinda de volta, Thalita 👋</p>
        </div>
        <Link to="/admin/appointments" className={styles.primaryBtn}>+ Novo Agendamento</Link>
      </div>

      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: s.color }}>{s.icon}</div>
            <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.sectionTitle}>Agendamentos Recentes</div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Data</th>
              <th>Horário</th>
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
        <Link to="/admin/appointments" className={styles.quickLink}>📅 Ver todos os agendamentos →</Link>
        <Link to="/admin/services" className={styles.quickLink}>✂ Gerenciar serviços →</Link>
        <Link to="/admin/gallery" className={styles.quickLink}>🖼 Atualizar galeria →</Link>
        <Link to="/admin/faq" className={styles.quickLink}>? Editar FAQ →</Link>
      </div>
    </div>
  )
}
