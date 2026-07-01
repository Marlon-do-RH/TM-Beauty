import { useState } from 'react'
import styles from './PageCommon.module.css'
import s from './FAQ.module.css'
import BookingButton from '../../components/BookingButton'

const faqs = [
  {
    q: 'Quanto tempo dura o tratamento de Nanoplastia?',
    a: 'O tratamento de Nanoplastia dura em média 3 a 4 horas, dependendo do comprimento e volume do cabelo. É recomendado reservar a tarde inteira para garantir que o processo seja feito com todo o cuidado necessário.',
  },
  {
    q: 'Posso lavar o cabelo no mesmo dia após o tratamento?',
    a: 'Para a Nanoplastia, recomendamos esperar pelo menos 72 horas antes de lavar o cabelo, evitar prender ou usar acessórios metálicos durante esse período. Já para o Botox Capilar, o tempo de espera é menor — usualmente 24 horas.',
  },
  {
    q: 'O tratamento é adequado para cabelos coloridos ou com descoloração?',
    a: 'Sim! A Nanoplastia e o Botox Capilar são seguros para cabelos coloridos e com mechas. Utilizamos fórmulas que respeitam a estrutura do cabelo e potencializam o resultado da coloração, deixando os fios ainda mais brilhantes.',
  },
  {
    q: 'Com que frequência devo repetir o tratamento?',
    a: 'A Nanoplastia tem durabilidade de 6 a 8 meses. O Botox Capilar dura em média 3 a 4 meses. O Deep Treatment pode ser realizado mensalmente para manutenção da saúde capilar. A frequência ideal varia conforme seu tipo de cabelo e rotina.',
  },
  {
    q: 'Os tratamentos contêm formol?',
    a: 'Não. Todos os tratamentos que ofereço são livres de formol e formoldeído. Utilizo fórmulas seguras e de alta performance, desenvolvidas para oferecer resultados excepcionais sem comprometer a saúde dos seus fios.',
  },
  {
    q: 'Preciso fazer alguma preparação antes do tratamento?',
    a: 'Recomendamos vir com o cabelo limpo, sem produtos como leave-in, óleo ou spray. Não é necessário fazer nenhuma preparação especial — você pode vir diretamente do trabalho ou de casa, como se sentir mais confortável.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>Suas dúvidas</p>
          <h1 className={styles.pageTitle}>Perguntas Frequentes</h1>
          <p className={styles.pageSubtitle}>Aqui estão as respostas para as perguntas que recebo com mais frequência.</p>
        </div>
      </section>

      <section className={s.faqSection}>
        <div className={s.inner}>
          <div className={s.faqList}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`${s.faqItem} ${open === i ? s.faqItemOpen : ''}`}
              >
                <button
                  className={s.faqQuestion}
                  onClick={() => setOpen(open === i ? null : i)}
                >
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
            <h3 className={s.faqCtaTitle}>Ainda tem dúvidas?</h3>
            <p className={s.faqCtaText}>Entre em contato diretamente pelo WhatsApp ou e-mail — responderei com prazer!</p>
            <BookingButton label="Fale Comigo" to="/contato" variant="primary" />
          </div>
        </div>
      </section>
    </div>
  )
}
