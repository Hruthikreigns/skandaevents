import { SERVICES, whatsappLink } from '../content/site'
import { photosFor, servicePhoto } from '../lib/media'
import { ServiceIcon, WhatsAppIcon } from './Icons'
import Picture from './Picture'

export default function Services({ showGalleryLinks, onViewCategory }) {
  return (
    <section className="section services" id="services" aria-labelledby="services-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">What we do</p>
          <h2 id="services-title">Services</h2>
          <p className="section-lede">
            Everything we offer for your occasion — tell us about your event and venue, and we will suggest a set-up that suits it.
          </p>
        </header>

        <ul className="service-grid">
          {SERVICES.map((s) => {
            const photo = servicePhoto(s)
            const hasGallery = s.gallery && photosFor(s.gallery).length > 0
            return (
              <li key={s.id} className="service-card">
                <div className="service-body">
                  <span className={`service-badge${photo ? ' has-photo' : ''}`}>
                    {photo ? (
                      <Picture image={photo} alt="" sizes="(max-width: 760px) 132px, 156px" />
                    ) : (
                      <ServiceIcon name={s.icon} width={34} height={34} />
                    )}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <div className="service-links">
                    <a
                      href={whatsappLink(
                        `Hello SKANDA EVENTS, I would like to enquire about ${s.enquiry}. Event date: \nVenue / area: \nDetails: `,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon width={16} height={16} />
                      Enquire<span className="sr-only"> about {s.title} on WhatsApp (opens in a new tab)</span>
                    </a>
                    {showGalleryLinks && hasGallery && (
                      <a href="#gallery" onClick={() => onViewCategory?.(s.gallery)}>
                        See photos<span className="sr-only"> in the gallery</span>
                      </a>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
