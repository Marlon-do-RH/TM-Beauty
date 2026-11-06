import { Link } from 'react-router-dom'
import {
  BookButton, WhatsAppButton, BeforeAfter, LengthGuide, Specialist,
  Experience, Reviews, Faq,
} from './lp/shared'
import { usePageMeta } from './lp/utils'
import './lp/lp.css'

// Must match the option label on the JotForm booking form.
const SERVICE = 'Hair Botox'

const RESULTS = [
  { name: 'botox-01', title: 'Frizz and puffiness', to: 'soft and polished', before: 'Before: frizzy, dry red hair', after: 'After: smooth red hair with soft waves' },
  { name: 'botox-02', title: 'Dense, dry waves', to: 'glossy and manageable', before: 'Before: dense, frizzy dark waves', after: 'After: smooth, glossy dark hair' },
  { name: 'botox-03', title: 'Damaged highlights', to: 'softer and shinier', before: 'Before: dry, frizzy highlighted hair', after: 'After: smooth, shiny blonde-highlighted hair' },
]

// Copied from the site's Reviews page.
const REVIEWS = [
  { name: '@camila_rbx', text: 'Best decision I ever made booking with Thalita! The Brazilian Botox is unreal.' },
  { name: 'Camila R.', text: 'Incredible experience from start to finish. Thalita really listens to what you want and the results are beyond what I expected.' },
  { name: 'Michelle K.', text: 'From the moment I walked in, I felt so welcome. The attention to detail is incredible, from the coffee to the massage cushion.' },
]

export default function HairBotox() {
  usePageMeta(
    'Hair Botox in Melbourne | Frizz & Volume Control · Nanoplasty by Thalita',
    'Brazilian Hair Botox in Bentleigh, Melbourne. Softer hair, controlled frizz and less volume for up to three months. Book with Brazilian hair specialist Thalita Medeiros.',
  )

  return (
    <div className="tm-lp">
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">Brazilian Hair Botox · Bentleigh, Melbourne</span>
            <h1>Hair Botox</h1>
            <p className="tagline">Hydration and volume under control.</p>
            <p className="lead">
              Softer hair, less frizz, less volume. Hair Botox is a treatment for dry, frizzy hair that improves softness and brings volume under control, with results that last up to three months.
            </p>
            <div className="cta-row">
              <BookButton service={SERVICE}>Book my Hair Botox</BookButton>
              <WhatsAppButton service={SERVICE} />
            </div>
            <div className="hero-proof">
              <span><span className="stars">★★★★★</span> 5.0 on Google</span>
              <span>10+ years of experience</span>
              <span>1000+ happy clients</span>
            </div>
          </div>
          <figure className="hero-media" style={{ margin: 0 }}>
            <BeforeAfter
              name="botox-01"
              eager
              before="Before Hair Botox: frizzy, dry red hair with volume at the roots"
              after="After Hair Botox: smooth, shiny red hair with soft waves"
              label="Drag to compare before and after"
            />
            <figcaption>Drag to compare · real client, treated by Thalita</figcaption>
          </figure>
        </div>
      </section>

      {/* KEY FACTS */}
      <section className="facts" aria-label="Treatment at a glance">
        <div className="wrap facts-grid">
          <div className="fact"><strong>Up to 3 months</strong><span>Lasting results</span></div>
          <div className="fact"><strong>0%</strong><span>Formaldehyde</span></div>
          <div className="fact"><strong>3–3½ h</strong><span>In the chair</span></div>
          <div className="fact"><strong>From A$220</strong><span>By hair length</span></div>
        </div>
      </section>

      {/* IS IT FOR YOU */}
      <section>
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Is Hair Botox for you?</span>
            <h2>For hair that’s dry, frizzy and hard to control</h2>
            <p className="lead">Hair Botox is the right choice when your main goal is softness and frizz control.</p>
          </div>
          <div className="fit-grid">
            <div className="fit"><span className="ico">✦</span><h3>Dry, rough lengths</h3><p>Colour, bleach and hot tools have left your hair rough and dull. Botox focuses on bringing back softness.</p></div>
            <div className="fit"><span className="ico">✧</span><h3>Frizz and puffiness</h3><p>Your hair puffs up the moment you step outside. Botox controls frizz and reduces volume.</p></div>
            <div className="fit"><span className="ico">◈</span><h3>A shorter commitment</h3><p>A shorter appointment and results that last up to three months, ideal for moderately damaged hair.</p></div>
          </div>
          <p className="not-for">
            <strong>Want hair that’s straight and lasts longer?</strong> Take a look at <Link to="/nanoplasty">Nanoplasty</Link>, which focuses on straightening and lasts around six months. Not sure? Thalita assesses your hair history and recommends the right one.
          </p>
        </div>
      </section>

      {/* WHAT IS IT */}
      <section className="what">
        <div className="wrap what-grid">
          <img className="what-img" src="/lp/botox-02-after.webp" alt="Glossy, smooth dark hair with highlights after Hair Botox" width="720" height="960" loading="lazy" />
          <div>
            <span className="eyebrow">What is Hair Botox</span>
            <h2>Softer, smoother hair with less frizz</h2>
            <p className="lead">
              Despite the name, Hair Botox involves no injections. It’s a Brazilian hair treatment that focuses on improving softness, controlling frizz and reducing volume. It can also loosen curls, so we talk through the result you want before we begin.
            </p>
            <ul className="checks">
              <li>Improves softness</li>
              <li>Controls frizz and reduces volume</li>
              <li>Results last up to three months</li>
              <li>Ideal for moderately damaged hair</li>
              <li>Simplifies your routine and cuts styling time</li>
            </ul>
            <BookButton service={SERVICE}>Book this service</BookButton>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="results" id="results">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Real transformations</span>
            <h2>Frizzy hair → silky smooth</h2>
            <p className="lead">Real clients, no filters. Drag each image to see the difference.</p>
          </div>
          <div className="results-grid">
            {RESULTS.map(r => (
              <figure key={r.name}>
                <BeforeAfter name={r.name} before={r.before} after={r.after} label={`Compare before and after: ${r.title}`} />
                <figcaption><strong>{r.title}</strong> → {r.to}</figcaption>
              </figure>
            ))}
          </div>
          <p className="results-note">
            Every hair is different, and results depend on your hair and your home care routine. <Link to="/before-after">See more transformations →</Link>
          </p>
        </div>
      </section>

      {/* PROCESS */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Your appointment</span>
            <h2>What to expect on the day</h2>
            <p className="lead">Allow approximately 3 to 3½ hours. Relax with a coffee and Brazilian snacks while we work.</p>
          </div>
          <div className="steps">
            <div className="step"><h3>Assessment</h3><p>Thalita reviews your hair history and the result you’d like: softness, frizz control or volume reduction.</p></div>
            <div className="step"><h3>Preparation</h3><p>Your hair is prepared so the product can be applied evenly.</p></div>
            <div className="step"><h3>Application</h3><p>The product is applied following the treatment protocol, then rinsed.</p></div>
            <div className="step"><h3>Blow-dry &amp; finish</h3><p>Heat activates the product. You leave with soft, shiny, frizz-free hair the same day.</p></div>
          </div>
          <p className="prep-note">
            <strong>Before your appointment:</strong> please shampoo your hair twice, without applying conditioner, a hair mask or styling products afterwards.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="wrap price-grid">
          <div className="price-card">
            <span className="eyebrow">Investment</span>
            <span className="from">From</span>
            <div className="amount">A$220 – A$350</div>
            <p className="dur">⏱ 3–3½ hours · price depends on length, density and texture</p>
            <ul className="checks">
              <li>Assessment of your hair history</li>
              <li>Blow-dry and finish on the day</li>
              <li>Home care guidance to make results last</li>
              <li>Full price explained before we begin</li>
            </ul>
            <div className="cta-row">
              <BookButton service={SERVICE}>Book this service</BookButton>
            </div>
          </div>
          <LengthGuide />
        </div>
      </section>

      {/* COMPARE */}
      <section>
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Choosing your treatment</span>
            <h2>Hair Botox or Nanoplasty?</h2>
            <p className="lead">The recommendation depends on the result you want and the condition of your hair.</p>
          </div>
          <div className="compare-wrap">
            <table className="compare-table">
              <thead><tr><th></th><th className="is-this">Hair Botox</th><th>Nanoplasty</th></tr></thead>
              <tbody>
                <tr><th>Focus</th><td className="is-this">Softness, frizz control and volume reduction</td><td>Straightening and volume reduction</td></tr>
                <tr><th>Lasts</th><td className="is-this">Up to 3 months</td><td>Around 6 months</td></tr>
                <tr><th>Time</th><td className="is-this">3–3½ hours</td><td>3½–5½ hours</td></tr>
                <tr><th>From</th><td className="is-this">A$220 – A$350</td><td>A$330 – A$550</td></tr>
              </tbody>
            </table>
          </div>
          <p className="compare-foot">Ready for straight hair? <Link to="/nanoplasty">Discover Nanoplasty →</Link></p>
        </div>
      </section>

      {/* AFTERCARE */}
      <section className="care">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Aftercare</span>
            <h2>Easy to live with</h2>
          </div>
          <div className="care-grid">
            <div className="care-item"><strong>Any time</strong><h3>Wash and tie it up</h3><p>No waiting period. You can wash your hair and tie it up whenever you like after the treatment.</p></div>
            <div className="care-item"><strong>After</strong><h3>Colour afterwards</h3><p>It’s better to colour your hair after the treatment, as the treatment may alter the colour.</p></div>
            <div className="care-item"><strong>Heat</strong><h3>Protect &amp; condition</h3><p>Use the recommended products, keep your hair conditioned and apply heat protectant whenever you use heat.</p></div>
          </div>
        </div>
      </section>

      <Specialist />
      <Reviews items={REVIEWS} />
      <Experience />
      <Faq service="botox" title="Hair Botox FAQ" />

      {/* FINAL CTA */}
      <section className="final" style={{ '--final-bg': "url('/lp/botox-03-after.webp')" }}>
        <div className="wrap">
          <span className="eyebrow">Ready for your transformation?</span>
          <h2>Soft, shiny, frizz-free hair</h2>
          <p className="lead">Book your Hair Botox in Bentleigh, or message Thalita to find out if it’s the right treatment for your hair.</p>
          <div className="cta-row">
            <BookButton service={SERVICE}>Book my Hair Botox</BookButton>
            <WhatsAppButton service={SERVICE} light icon={false} />
          </div>
          <p className="contact-line">Bentleigh, Melbourne VIC · +61 450 442 869</p>
        </div>
      </section>
    </div>
  )
}
