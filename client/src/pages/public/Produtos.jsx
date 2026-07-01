import styles from './PageCommon.module.css'
import s from './Produtos.module.css'

export default function Produtos() {
  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>Em breve</p>
          <h1 className={styles.pageTitle}>Produtos</h1>
          <p className={styles.pageSubtitle}>A linha exclusiva Lisse by Thalita está chegando.</p>
        </div>
      </section>

      <section className={s.comingSoon}>
        <div className={s.inner}>
          <div className={s.badge}>Em Breve</div>
          <h2 className={s.comingSoonTitle}>Lisse by Thalita</h2>
          <p className={s.comingSoonSub}>
            Uma linha de produtos capilares exclusiva, desenvolvida com as melhores fórmulas brasileiras para cuidados em casa.
          </p>
          <p className={s.comingSoonText}>
            Estou trabalhando para trazer o melhor da tecnologia capilar brasileira diretamente para a sua rotina. Em breve, você poderá prolongar e potencializar os resultados dos seus tratamentos com os produtos Lisse by Thalita.
          </p>

          <div className={s.teaseCards}>
            <div className={s.teaseCard}>
              <span className={s.teaseIcon}>✦</span>
              <h3>Shampoo & Condicionador</h3>
              <p>Fórmulas exclusivas para manter o alisamento</p>
            </div>
            <div className={s.teaseCard}>
              <span className={s.teaseIcon}>✧</span>
              <h3>Máscara Reconstrutiva</h3>
              <p>Tratamento intensivo para uso semanal</p>
            </div>
            <div className={s.teaseCard}>
              <span className={s.teaseIcon}>◈</span>
              <h3>Leave-in Premium</h3>
              <p>Proteção e brilho para o dia a dia</p>
            </div>
          </div>

          <div className={s.notifyForm}>
            <p className={s.notifyTitle}>Seja a primeira a saber quando lançarmos!</p>
            <form onSubmit={e => e.preventDefault()} className={s.notifyRow}>
              <input type="email" placeholder="Seu e-mail" className={s.notifyInput} />
              <button type="submit" className={s.notifyBtn}>Notifique-me</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
