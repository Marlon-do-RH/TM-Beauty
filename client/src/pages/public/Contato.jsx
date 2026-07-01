import { useState } from 'react'
import styles from './PageCommon.module.css'
import s from './Contato.module.css'
import BookingButton from '../../components/BookingButton'

export default function Contato() {
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>Fale comigo</p>
          <h1 className={styles.pageTitle}>Contato</h1>
          <p className={styles.pageSubtitle}>Entre em contato para agendar sua consulta ou tirar qualquer dúvida.</p>
        </div>
      </section>

      <section className={s.contactSection}>
        <div className={s.inner}>
          <div className={s.contactGrid}>
            {/* Info */}
            <div className={s.infoCol}>
              <div className={s.infoBlock}>
                <h3 className={s.infoTitle}>Localização</h3>
                <p className={s.infoText}>Melbourne, Victoria, Australia</p>
              </div>

              <div className={s.infoBlock}>
                <h3 className={s.infoTitle}>Contato Direto</h3>
                <div className={s.contactLinks}>
                  <a href="tel:+61400000000" className={s.contactLink}>
                    <span className={s.contactLinkIcon}>📞</span>
                    <span>+61 400 000 000</span>
                  </a>
                  <a href="https://wa.me/61400000000" target="_blank" rel="noreferrer" className={s.contactLink}>
                    <span className={s.contactLinkIcon}>💬</span>
                    <span>WhatsApp</span>
                  </a>
                  <a href="mailto:hello@thalitamedeiros.com.au" className={s.contactLink}>
                    <span className={s.contactLinkIcon}>✉</span>
                    <span>hello@thalitamedeiros.com.au</span>
                  </a>
                  <a href="https://instagram.com/thalita.medeiros.hair" target="_blank" rel="noreferrer" className={s.contactLink}>
                    <span className={s.contactLinkIcon}>📷</span>
                    <span>@thalita.medeiros.hair</span>
                  </a>
                </div>
              </div>

              <div className={s.infoBlock}>
                <h3 className={s.infoTitle}>Horário de Atendimento</h3>
                <div className={s.hours}>
                  <div className={s.hoursRow}><span>Segunda — Sexta</span><span>9h às 18h</span></div>
                  <div className={s.hoursRow}><span>Sábado</span><span>9h às 15h</span></div>
                  <div className={s.hoursRow}><span>Domingo</span><span>Fechado</span></div>
                </div>
              </div>

              <div className={s.mapPlaceholder}>
                <div className={s.mapInner}>📍 Melbourne, VIC, Australia</div>
              </div>
            </div>

            {/* Form */}
            <div className={s.formCol}>
              <h2 className={s.formTitle}>Solicitar Consulta</h2>
              <p className={s.formSub}>Preencha o formulário e entrarei em contato em até 24 horas.</p>

              {sent ? (
                <div className={s.successMsg}>
                  <span className={s.successIcon}>✓</span>
                  <h3>Mensagem enviada!</h3>
                  <p>Obrigada pelo contato. Responderei em breve.</p>
                </div>
              ) : (
                <form className={s.form} onSubmit={handleSubmit}>
                  <div className={s.field}>
                    <label className={s.label}>Nome completo *</label>
                    <input
                      type="text"
                      required
                      className={s.input}
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Seu nome"
                    />
                  </div>

                  <div className={s.field}>
                    <label className={s.label}>E-mail *</label>
                    <input
                      type="email"
                      required
                      className={s.input}
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className={s.field}>
                    <label className={s.label}>Serviço de interesse</label>
                    <select
                      className={s.input}
                      value={form.service}
                      onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                    >
                      <option value="">Selecione um serviço</option>
                      <option>Brazilian Nanoplastia</option>
                      <option>Brazilian Botox</option>
                      <option>Deep Treatment</option>
                      <option>Consulta Gratuita</option>
                    </select>
                  </div>

                  <div className={s.field}>
                    <label className={s.label}>Mensagem *</label>
                    <textarea
                      required
                      rows={5}
                      className={s.textarea}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Conte-me sobre o seu cabelo e o que está buscando..."
                    />
                  </div>

                  <button type="submit" className={s.submitBtn}>
                    Enviar Mensagem
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={s.bookSection}>
        <div className={s.inner}>
          <h2 className={s.bookTitle}>Pronta para começar?</h2>
          <p className={s.bookText}>Agende diretamente pelo WhatsApp para uma resposta ainda mais rápida.</p>
          <a
            href="https://wa.me/61400000000?text=Olá Thalita! Gostaria de agendar uma consulta."
            target="_blank"
            rel="noreferrer"
            className={s.whatsappBtn}
          >
            💬 Agendar pelo WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
