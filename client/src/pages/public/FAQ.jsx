import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './PageCommon.module.css'
import s from './FAQ.module.css'
import BookingButton from '../../components/BookingButton'

export default function FAQ() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(null)

  const faqs = [
    { q: t('faq', 'q1'), a: t('faq', 'a1') },
    { q: t('faq', 'q2'), a: t('faq', 'a2') },
    { q: t('faq', 'q3'), a: t('faq', 'a3') },
    { q: t('faq', 'q4'), a: t('faq', 'a4') },
    { q: t('faq', 'q5'), a: t('faq', 'a5') },
    { q: t('faq', 'q6'), a: t('faq', 'a6') },
  ]

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
            {faqs.map((faq, i) => (
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
