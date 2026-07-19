import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './PageCommon.module.css'
import s from './Contato.module.css'

export default function Contato() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setSent(true)
  }

  const serviceOptions = [
    'Brazilian Nanoplastia',
    t('servicos', 'botox')?.name || 'Brazilian Botox',
    t('servicos', 'deep')?.name || 'Deep Treatment',
  ]

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('contato', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('contato', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('contato', 'subtitle')}</p>
        </div>
      </section>

      <section className={s.contactSection}>
        <div className={s.inner}>
          <div className={s.contactGrid}>
            {/* Info */}
            <div className={s.infoCol}>
              <div className={s.infoBlock}>
                <h3 className={s.infoTitle}>{t('contato', 'location')}</h3>
                <p className={s.infoText}>100 Wells St, Southbank VIC 3006</p>
              </div>

              <div className={s.infoBlock}>
                <h3 className={s.infoTitle}>{t('contato', 'directContact')}</h3>
                <div className={s.contactLinks}>
                  <a href="tel:+61450442869" className={s.contactLink}><span className={s.contactLinkIcon}>📞</span><span>+61 450 442 869</span></a>
                  <a href="https://wa.me/61450442869" target="_blank" rel="noreferrer" className={s.contactLink}><span className={s.contactLinkIcon}>💬</span><span>WhatsApp</span></a>
                  <a href="mailto:hello@thalitamedeiros.com.au" className={s.contactLink}><span className={s.contactLinkIcon}>✉</span><span>hello@thalitamedeiros.com.au</span></a>
                  <a href="https://instagram.com/thalita.medeiros.hair" target="_blank" rel="noreferrer" className={s.contactLink}><span className={s.contactLinkIcon}>📷</span><span>@thalita.medeiros.hair</span></a>
                </div>
              </div>

              <div className={s.infoBlock}>
                <h3 className={s.infoTitle}>{t('contato', 'hours')}</h3>
                <div className={s.hours}>
                  <div className={s.hoursRow}><span>{t('contato', 'monFri')}</span><span>9h–18h</span></div>
                  <div className={s.hoursRow}><span>{t('contato', 'sat')}</span><span>9h–15h</span></div>
                  <div className={s.hoursRow}><span>{t('contato', 'sun')}</span><span>{t('contato', 'closed')}</span></div>
                </div>
              </div>

              <div className={s.mapEmbed}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.3812385175224!2d144.96832229999998!3d-37.827959899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642aec9189039%3A0xf471078d67ce75d1!2s100%20Wells%20St%2C%20Southbank%20VIC%203006!5e0!3m2!1spt-BR!2sau!4v1784464790192!5m2!1spt-BR!2sau"
                  width="100%"
                  height="260"
                  style={{ border: 0, borderRadius: 6 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="TM Beauty Studio location"
                />
              </div>
            </div>

            {/* Form */}
            <div className={s.formCol}>
              <h2 className={s.formTitle}>{t('contato', 'formTitle')}</h2>
              <p className={s.formSub}>{t('contato', 'formSub')}</p>

              {sent ? (
                <div className={s.successMsg}>
                  <span className={s.successIcon}>✓</span>
                  <h3>{t('contato', 'successTitle')}</h3>
                  <p>{t('contato', 'successText')}</p>
                </div>
              ) : (
                <form className={s.form} onSubmit={handleSubmit}>
                  <div className={s.field}>
                    <label className={s.label}>{t('contato', 'name')}</label>
                    <input type="text" required className={s.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t('contato', 'namePlaceholder')} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>{t('contato', 'email')}</label>
                    <input type="email" required className={s.input} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder={t('contato', 'emailPlaceholder')} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>{t('contato', 'service')}</label>
                    <select className={s.input} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                      <option value="">{t('contato', 'servicePlaceholder')}</option>
                      {serviceOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>{t('contato', 'message')}</label>
                    <textarea required rows={5} className={s.textarea} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder={t('contato', 'messagePlaceholder')} />
                  </div>
                  <button type="submit" className={s.submitBtn}>{t('contato', 'send')}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={s.bookSection}>
        <div className={s.inner}>
          <h2 className={s.bookTitle}>{t('contato', 'bookTitle')}</h2>
          <p className={s.bookText}>{t('contato', 'bookText')}</p>
          <a href="https://wa.me/61450442869?text=Olá Thalita! Gostaria de agendar uma consulta." target="_blank" rel="noreferrer" className={s.whatsappBtn}>
            {t('contato', 'whatsappBtn')}
          </a>
        </div>
      </section>
    </div>
  )
}
