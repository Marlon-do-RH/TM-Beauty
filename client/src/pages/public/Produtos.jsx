import { useLanguage } from '../../i18n/LanguageContext'
import styles from './PageCommon.module.css'
import s from './Produtos.module.css'

export default function Produtos() {
  const { t } = useLanguage()

  const teaseCards = [
    { icon: '✦', title: t('produtos', 'shampoo'), desc: t('produtos', 'shampooDesc') },
    { icon: '✧', title: t('produtos', 'mask'), desc: t('produtos', 'maskDesc') },
    { icon: '◈', title: t('produtos', 'leaveIn'), desc: t('produtos', 'leaveInDesc') },
  ]

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('produtos', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('produtos', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('produtos', 'subtitle')}</p>
        </div>
      </section>

      <section className={s.comingSoon}>
        <div className={s.inner}>
          <div className={s.badge}>{t('produtos', 'badge')}</div>
          <h2 className={s.comingSoonTitle}>{t('produtos', 'comingSoonTitle')}</h2>
          <p className={s.comingSoonSub}>{t('produtos', 'comingSoonSub')}</p>
          <p className={s.comingSoonText}>{t('produtos', 'comingSoonText')}</p>

          <div className={s.teaseCards}>
            {teaseCards.map(c => (
              <div key={c.title} className={s.teaseCard}>
                <span className={s.teaseIcon}>{c.icon}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>

          <div className={s.notifyForm}>
            <p className={s.notifyTitle}>{t('produtos', 'notifyTitle')}</p>
            <form onSubmit={e => e.preventDefault()} className={s.notifyRow}>
              <input type="email" placeholder={t('produtos', 'notifyPlaceholder')} className={s.notifyInput} />
              <button type="submit" className={s.notifyBtn}>{t('produtos', 'notifyBtn')}</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
