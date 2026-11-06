import { useState } from 'react'
import { Link } from 'react-router-dom'
import { faqFor } from './faqData'
import { BOOKING_PATH, whatsappUrl } from './utils'

export function BookButton({ children, className = 'btn btn-gold' }) {
  return (
    <Link className={className} to={BOOKING_PATH}>
      {children}
    </Link>
  )
}

const WhatsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2S21.8 6.6 21.8 12 17.4 21.8 12 21.8zM12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12S18.6 0 12 0z" />
  </svg>
)

export function WhatsAppButton({ service, light = false, icon = true }) {
  return (
    <a
      className={`btn ${light ? 'btn-light' : 'btn-line'}`}
      href={whatsappUrl(service)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon && <WhatsIcon />}
      Ask on WhatsApp
    </a>
  )
}

/** Drag-to-compare before/after image. */
export function BeforeAfter({ name, before, after, label, eager = false }) {
  const [pos, setPos] = useState(50)
  const loading = eager ? 'eager' : 'lazy'
  return (
    <div className="ba" style={{ '--pos': `${pos}%` }}>
      <img className="ba-after" src={`/lp/${name}-after.webp`} alt={after} width="720" height="960" loading={loading} fetchPriority={eager ? 'high' : undefined} />
      <img className="ba-before" src={`/lp/${name}-before.webp`} alt={before} width="720" height="960" loading={loading} />
      <span className="tag tag-b">Before</span>
      <span className="tag tag-a">After</span>
      <div className="ba-line" />
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={e => setPos(Number(e.target.value))}
        aria-label={label}
      />
      <div className="ba-knob" aria-hidden="true">‹ ›</div>
    </div>
  )
}

export function LengthGuide() {
  return (
    <div>
      <span className="eyebrow">A simple reference</span>
      <h2 style={{ fontSize: 'clamp(28px,3.4vw,38px)', marginBottom: 12 }}>Hair length guide</h2>
      <p className="lead">
        Measure from the roots to the ends along a section at the back of your head. For curly or coily hair, gently stretch the section before measuring.
      </p>
      <table className="length-table">
        <tbody>
          <tr><td>Short</td><td>Up to 20 cm</td></tr>
          <tr><td>Medium</td><td>Over 20 cm, up to 35 cm</td></tr>
          <tr><td>Long</td><td>Over 35 cm, up to 50 cm</td></tr>
          <tr><td>Extra long</td><td>Over 50 cm</td></tr>
        </tbody>
      </table>
      <p className="small">
        Price depends on your hair’s length, density and texture. Any additional charges are explained before we begin, so you can review and approve the full price.
      </p>
    </div>
  )
}

export function Specialist() {
  return (
    <section className="about">
      <div className="wrap about-grid">
        <img className="about-img" src="/lp/thalita.webp" alt="Thalita Medeiros, Brazilian hair specialist" width="720" height="900" loading="lazy" />
        <div>
          <span className="eyebrow">Your specialist</span>
          <h2>Thalita Medeiros</h2>
          <p className="lead">
            Originally from São Paulo, Thalita has specialised in advanced Brazilian hair techniques for more than 10 years. Her training took her from Brazil to France, and then to Melbourne, where she opened her studio in Bentleigh.
          </p>
          <p className="lead">
            Her philosophy is simple: your hair doesn’t need to change to be beautiful. Every treatment starts with an assessment of your hair history and the result you want.
          </p>
          <div className="about-stats">
            <div><strong>10+</strong><span>Years</span></div>
            <div><strong>3</strong><span>Countries</span></div>
            <div><strong>1000+</strong><span>Clients</span></div>
          </div>
          <p className="langs">Consultations in English, Portuguese, Spanish and French.</p>
        </div>
      </div>
    </section>
  )
}

export function Experience() {
  return (
    <section>
      <div className="wrap center">
        <span className="eyebrow">More than a service</span>
        <h2 style={{ fontSize: 'clamp(30px,3.6vw,40px)', marginBottom: 12 }}>A complete experience</h2>
        <p className="lead" style={{ marginBottom: 26 }}>A few hours in the chair should feel like time for yourself.</p>
        <div className="amen">
          <span>☕ Premium coffee</span><span>🍫 Brazilian snacks</span><span>🌸 Relaxing aroma</span>
          <span>📶 Free Wi-Fi</span><span>🔋 Phone charging</span><span>💧 Sparkling water</span><span>📖 Magazines</span>
        </div>
      </div>
    </section>
  )
}

export function Reviews({ items }) {
  return (
    <section className="reviews">
      <div className="wrap">
        <div className="sec-head center">
          <span className="eyebrow">What they say</span>
          <h2>Loved by clients across Melbourne</h2>
          <p className="lead"><span className="stars">★★★★★</span> 5.0 on Google Reviews</p>
        </div>
        <div className="rev-grid">
          {items.map(r => (
            <div className="rev" key={r.name}>
              <span className="stars">★★★★★</span>
              <blockquote>“{r.text}”</blockquote>
              <cite>{r.name}</cite>
            </div>
          ))}
        </div>
        <div className="rev-more"><Link className="btn btn-light" to="/reviews">Read all reviews</Link></div>
      </div>
    </section>
  )
}

export function Faq({ service, title }) {
  const groups = faqFor(service)
  return (
    <section style={{ paddingTop: 0 }} id="faq">
      <div className="wrap">
        <div className="sec-head center">
          <span className="eyebrow">Your questions</span>
          <h2>{title}</h2>
        </div>
        {groups.map(g => (
          <div className="faq-group" key={g.title}>
            <h3>{g.title}</h3>
            <div className="faq-list">
              {g.items.map(it => (
                <details key={it.q}>
                  <summary>{it.q}</summary>
                  <p>{it.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
