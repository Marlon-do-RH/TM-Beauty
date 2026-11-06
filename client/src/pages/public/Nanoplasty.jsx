import { Link } from 'react-router-dom'
import { FIRST_VISIT_CODE, FIRST_VISIT_PERCENT } from '../../lib/coupon'
import {
  BookButton, WhatsAppButton, BeforeAfter, LengthGuide, Specialist,
  Experience, Reviews, Faq,
} from './lp/shared'
import { usePageMeta } from './lp/utils'
import './lp/lp.css'

const SERVICE = 'Nanoplasty'

const RESULTS = [
  { name: 'nano-02', title: 'Blonde, frizzy curls', to: 'glossy and straight', before: 'Before: frizzy, curly blonde hair', after: 'After: sleek straight blonde hair' },
  { name: 'nano-03', title: 'Dense, frizzy waves', to: 'smooth and controlled', before: 'Before: dense, frizzy dark waves', after: 'After: smooth straight dark hair' },
  { name: 'nano-04', title: 'Coloured, dry ends', to: 'shine from root to tip', before: 'Before: wavy hair with dry, lightened ends', after: 'After: straight, shiny hair' },
  { name: 'nano-05', title: 'Frizz and volume', to: 'sleek and silky', before: 'Before: frizzy brown waves', after: 'After: sleek straight light brown hair' },
  { name: 'nano-06', title: 'Root frizz', to: 'mirror-like shine', before: 'Before: dark hair with frizz at the roots', after: 'After: smooth, shiny straight black hair' },
  { name: 'nano-01', title: 'Tight, voluminous curls', to: 'long and fluid', before: 'Before: tight, voluminous curls', after: 'After: long straight brown hair' },
]

// Copied from the site's Reviews page.
const REVIEWS = [
  { name: 'Ana P.', text: 'The Nanoplastia treatment was life-changing. My hair used to take 45 minutes to style. Now it’s perfect in 10 minutes.' },
  { name: 'Sarah M.', text: 'Absolutely amazing! My hair has never felt this smooth and shiny. Thalita is a true artist: so professional, caring, and knowledgeable.' },
  { name: 'Jessica T.', text: 'I’ve been going to Thalita for 2 years and I will never go anywhere else. The best hair treatment in Melbourne!' },
]

function Offer() {
  return (
    <p className="gift">
      First time with us? Get <strong>{FIRST_VISIT_PERCENT}% off</strong> your first Nanoplasty. Use code <code>{FIRST_VISIT_CODE}</code> at checkout when you book.
    </p>
  )
}

export default function Nanoplasty() {
  usePageMeta(
    'Nanoplasty in Melbourne | Hair Straightening · Nanoplasty by Thalita',
    'Nanoplasty hair straightening in Bentleigh, Melbourne. Smooth, frizz-free hair with less volume for around six months. Book with Brazilian hair specialist Thalita Medeiros.',
  )

  return (
    <div className="tm-lp">
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">Hair straightening · Bentleigh, Melbourne</span>
            <h1>Nanoplasty</h1>
            <p className="tagline">The straightening of the future, today.</p>
            <p className="lead">
              Wake up to smooth, silky, frizz-free hair. Nanoplasty straightens the hair and reduces volume, so your hair stays sleek and easy to manage for around six months, with a result that looks natural.
            </p>
            <div className="cta-row">
              <BookButton service={SERVICE}>Book my Nanoplasty</BookButton>
              <WhatsAppButton service={SERVICE} />
            </div>
            <div className="hero-proof">
              <span><span className="stars">★★★★★</span> 5.0 on Google</span>
              <span>10+ years of experience</span>
              <span>{FIRST_VISIT_PERCENT}% off your first Nanoplasty</span>
            </div>
          </div>
          <figure className="hero-media" style={{ margin: 0 }}>
            <BeforeAfter
              name="nano-01"
              eager
              before="Before Nanoplasty: long, voluminous, tightly curled frizzy hair"
              after="After Nanoplasty: long, sleek, straight brown hair"
              label="Drag to compare before and after"
            />
            <figcaption>Drag to compare · real client, treated by Thalita</figcaption>
          </figure>
        </div>
      </section>

      {/* KEY FACTS */}
      <section className="facts" aria-label="Treatment at a glance">
        <div className="wrap facts-grid">
          <div className="fact"><strong>~6 months</strong><span>Lasting results</span></div>
          <div className="fact"><strong>0%</strong><span>Formaldehyde</span></div>
          <div className="fact"><strong>3½–5½ h</strong><span>In the chair</span></div>
          <div className="fact"><strong>From A$330</strong><span>By hair length</span></div>
        </div>
      </section>

      {/* IS IT FOR YOU */}
      <section>
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Is Nanoplasty for you?</span>
            <h2>Made for hair that won’t behave</h2>
            <p className="lead">If any of these sound familiar, Nanoplasty was designed for you.</p>
          </div>
          <div className="fit-grid">
            <div className="fit"><span className="ico">✦</span><h3>Frizz that never gives up</h3><p>Melbourne’s humidity turns a good blow-dry into frizz by lunchtime. Nanoplasty helps keep it smooth and under control.</p></div>
            <div className="fit"><span className="ico">✧</span><h3>Hours lost to styling</h3><p>Stop fighting your hair every morning. The aim is a simpler routine: a quick blow-dry and you’re ready.</p></div>
            <div className="fit"><span className="ico">◈</span><h3>Too much volume</h3><p>Curly, wavy or very voluminous hair that you want straighter, lighter and easier to control.</p></div>
          </div>
          <p className="not-for">
            <strong>Mainly after softness and frizz control?</strong> You might be a better match for our <Link to="/botox">Hair Botox</Link>, a shorter-lasting treatment focused on softness and frizz. Not sure? Thalita assesses your hair history and recommends the right one.
          </p>
        </div>
      </section>

      {/* WHAT IS IT */}
      <section className="what">
        <div className="wrap what-grid">
          <img className="what-img" src="/lp/nano-02-after.webp" alt="Sleek, glossy blonde hair after Nanoplasty" width="720" height="960" loading="lazy" />
          <div>
            <span className="eyebrow">What is Nanoplasty</span>
            <h2>Straight, silky hair that still looks like <em>your</em> hair</h2>
            <p className="lead">
              Nanoplasty is an advanced Brazilian straightening treatment. The product is applied to the hair, rinsed, then activated with heat during the blow-dry and straightening. The result is hair that is smoother, shinier and lighter, with the level of straightening agreed with you before we start.
            </p>
            <ul className="checks">
              <li>Straightens the hair and reduces volume</li>
              <li>Results last around six months</li>
              <li>Curls don’t return in the treated sections</li>
              <li>Suitable for coloured, blonde and highlighted hair, after assessment</li>
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
            <h2>The results speak for themselves</h2>
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
            Every hair is different. Results depend on your hair’s texture, resistance and chemical history, and some hair may need more than one session. <Link to="/before-after">See more transformations →</Link>
          </p>
        </div>
      </section>

      {/* PROCESS */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Your appointment</span>
            <h2>What to expect on the day</h2>
            <p className="lead">
              Allow approximately 3½ to 5½ hours. Tightly coiled or very dense hair may need 5 to 8 hours. Relax with a coffee and Brazilian snacks while we work.
            </p>
          </div>
          <div className="steps">
            <div className="step"><h3>Assessment</h3><p>Thalita reviews your hair history and agrees with you the level of straightening and volume reduction you want.</p></div>
            <div className="step"><h3>Preparation</h3><p>Your hair is prepared so the product can be applied evenly.</p></div>
            <div className="step"><h3>Application</h3><p>The product is applied following the treatment protocol, then rinsed.</p></div>
            <div className="step"><h3>Blow-dry &amp; straighten</h3><p>Heat activates the product. You leave with smooth, glossy hair the same day.</p></div>
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
            <div className="amount">A$330 – A$550</div>
            <p className="dur">⏱ 3½–5½ hours · price depends on length, density and texture</p>
            <ul className="checks">
              <li>Assessment of your hair history</li>
              <li>Blow-dry and straightening on the day</li>
              <li>Home care guidance to make results last</li>
              <li>Full price explained before we begin</li>
            </ul>
            <div className="cta-row">
              <BookButton service={SERVICE}>Book this service</BookButton>
            </div>
            <Offer />
          </div>
          <LengthGuide />
        </div>
      </section>

      {/* COMPARE */}
      <section>
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Choosing your treatment</span>
            <h2>Nanoplasty or Hair Botox?</h2>
            <p className="lead">The recommendation depends on the result you want and the condition of your hair.</p>
          </div>
          <div className="compare-wrap">
            <table className="compare-table">
              <thead><tr><th></th><th className="is-this">Nanoplasty</th><th>Hair Botox</th></tr></thead>
              <tbody>
                <tr><th>Focus</th><td className="is-this">Straightening and volume reduction</td><td>Softness, frizz control and volume reduction</td></tr>
                <tr><th>Lasts</th><td className="is-this">Around 6 months</td><td>Up to 3 months</td></tr>
                <tr><th>Time</th><td className="is-this">3½–5½ hours</td><td>3–3½ hours</td></tr>
                <tr><th>From</th><td className="is-this">A$330 – A$550</td><td>A$220 – A$350</td></tr>
              </tbody>
            </table>
          </div>
          <p className="compare-foot">Mainly after softness and frizz control? <Link to="/botox">Discover Hair Botox →</Link></p>
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
            <div className="care-item"><strong>6 cm</strong><h3>Root touch-ups</h3><p>Touch-ups are planned around your regrowth. The root touch-up covers up to 6 cm of regrowth.</p></div>
          </div>
        </div>
      </section>

      <Specialist />
      <Reviews items={REVIEWS} />
      <Experience />
      <Faq service="nano" title="Nanoplasty FAQ" />

      {/* FINAL CTA */}
      <section className="final" style={{ '--final-bg': "url('/lp/nano-05-after.webp')" }}>
        <div className="wrap">
          <span className="eyebrow">Ready for your transformation?</span>
          <h2>Smooth, silky hair for around six months</h2>
          <p className="lead">Book your Nanoplasty in Bentleigh, or message Thalita to find out if it’s the right treatment for your hair.</p>
          <div className="cta-row">
            <BookButton service={SERVICE}>Book my Nanoplasty</BookButton>
            <WhatsAppButton service={SERVICE} light icon={false} />
          </div>
          <p className="gift-line">First Nanoplasty? Use code <code>{FIRST_VISIT_CODE}</code> at checkout for {FIRST_VISIT_PERCENT}% off.</p>
          <p className="contact-line">Bentleigh, Melbourne VIC · +61 450 442 869</p>
        </div>
      </section>
    </div>
  )
}
