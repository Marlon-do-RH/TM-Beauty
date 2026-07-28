import { useState, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './PageCommon.module.css'
import s from './FAQ.module.css'
import BookingButton from '../../components/BookingButton'

const FAQ_KEYS = [
  { q: 'q1', a: 'a1' }, { q: 'q2', a: 'a2' }, { q: 'q3', a: 'a3' },
  { q: 'q4', a: 'a4' }, { q: 'q5', a: 'a5' }, { q: 'q6', a: 'a6' },
]

export default function FAQ() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(null)
  const [faqs, setFaqs] = useState(null) // null = loading

  useEffect(() => {
    fetch('/api/faq')
      .then(r => r.json())
      .then(data => setFaqs(Array.isArray(data) ? data : []))
      .catch(() => setFaqs([]))
  }, [])

  const items = faqs === null
    ? null
    : faqs.length > 0
      ? faqs.map(f => ({ q: f.question, a: f.answer }))
      : FAQ_KEYS.map(f => ({ q: t('faq', f.q), a: t('faq', f.a) }))

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>{t('faq', 'eyebrow')}</p>
          <h1 className={styles.pageTitle}>{t('faq', 'title')}</h1>
          <p className={styles.pageSubtitle}>{t('faq', 'subtitle')}</p>
        </div>
      </section>

      <section className={s.faqSection}>
        <div className={s.inner}>
          <div className={s.faqList}>
            {items === null ? null : items.map((faq, i) => (
              <div key={i} className={`${s.faqItem} ${open === i ? s.faqItemOpen : ''}`}>
                <button className={s.faqQuestion} onClick={() => setOpen(open === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className={s.faqChevron}>{open === i ? '−' : '+'}</span>
                </button>
                {open === i && (
                  <div className={s.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={s.faqCta}>
            <h3 className={s.faqCtaTitle}>{t('faq', 'stillQuestions')}</h3>
            <p className={s.faqCtaText}>{t('faq', 'stillText')}</p>
            <BookingButton label={t('faq', 'contactBtn')} to="/contato" variant="primary" />
          </div>
        </div>
      </section>
    </div>
  )
}
