import { BUSINESS } from '../content/site'
import { media } from '../lib/media'
import Picture from './Picture'

const STEPS = [
  { title: 'Share your occasion', text: 'Message us on WhatsApp or call with the event type, date and venue.' },
  { title: 'Talk through ideas', text: 'We discuss the look you want and what suits the space.' },
  { title: 'Confirm with our team', text: 'Availability and pricing are confirmed directly with us before anything is booked.' },
]

export default function About() {
  const invitation = media.invitation[0]
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className={`container about-grid${invitation ? ' has-media' : ''}`}>
        <div className="about-copy">
          <p className="eyebrow">About us</p>
          <h2 id="about-title">Event styling with a personal touch</h2>
          <p>
            {BUSINESS.name} styles celebrations — theme and balloon décor, birthday party set-ups, weddings and
            special events, cold pyro, spark and smoke entries, and mascot characters. We start from your occasion,
            your venue and your ideas, and shape a setting that feels festive in person and looks beautiful in your
            photos.
          </p>
          <p>
            You will find our shop near SLV Mandapam, Badumakulapalli, Santhipuram.
          </p>
          <ol className="steps" aria-label="How an enquiry works">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="step-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {invitation && (
          <figure className="about-media">
            <div className="frame">
              <Picture image={invitation} sizes="(max-width: 900px) 88vw, 480px" />
            </div>
            <figcaption>Our shop-opening invitation · {BUSINESS.shopOpening.label}</figcaption>
          </figure>
        )}
      </div>
    </section>
  )
}
