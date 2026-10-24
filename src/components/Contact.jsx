import { useId, useMemo, useState } from 'react'
import { BUSINESS, DEFAULT_ENQUIRY, instagramHandle, OCCASIONS, whatsappLink } from '../content/site'
import { CameraIcon, PhoneIcon, PinIcon, WhatsAppIcon } from './Icons'

export default function Contact() {
  const uid = useId()
  const [occasion, setOccasion] = useState('')
  const [date, setDate] = useState('')
  const [venue, setVenue] = useState('')
  const [message, setMessage] = useState(DEFAULT_ENQUIRY)

  const fullMessage = useMemo(() => {
    const lines = [message.trim() || DEFAULT_ENQUIRY]
    if (occasion) lines.push(`Occasion: ${occasion}`)
    if (date) {
      const d = new Date(`${date}T00:00:00`)
      lines.push(`Event date: ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`)
    }
    if (venue.trim()) lines.push(`Venue / area: ${venue.trim()}`)
    return lines.join('\n')
  }, [message, occasion, date, venue])

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <div className="contact-intro">
          <p className="eyebrow">Get in touch</p>
          <h2 id="contact-title">Plan your celebration</h2>
          <p className="section-lede">
            Call us or send a WhatsApp enquiry. We will get back to you to discuss your event, availability and
            pricing.
          </p>

          <ul className="phone-list" aria-label="Phone numbers">
            {BUSINESS.phones.map((p) => (
              <li key={p.tel}>
                <a className="phone-card" href={`tel:${p.tel}`}>
                  <span className="phone-icon">
                    <PhoneIcon width={20} height={20} />
                  </span>
                  <span>
                    <span className="phone-label">Call</span>
                    <span className="phone-number">{p.display}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="fine">WhatsApp enquiries go to {BUSINESS.whatsapp.display}.</p>

          <a className="phone-card location-card" href={BUSINESS.location.mapsUrl} target="_blank" rel="noopener noreferrer">
            <span className="phone-icon">
              <PinIcon width={20} height={20} />
            </span>
            <span>
              <span className="phone-label">Shop</span>
              <span className="location-text">
                {BUSINESS.location.line1}, {BUSINESS.location.line2}
              </span>
              <span className="location-link">
                Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
              </span>
            </span>
          </a>

          {BUSINESS.instagram && (
            <a className="phone-card social-card" href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer">
              <span className="phone-icon">
                <CameraIcon width={20} height={20} />
              </span>
              <span>
                <span className="phone-label">Follow us on Instagram</span>
                <span className="location-text">{instagramHandle()}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          )}
        </div>

        <form
          className="enquiry"
          aria-labelledby={`${uid}-title`}
          onSubmit={(e) => {
            e.preventDefault()
            window.open(whatsappLink(fullMessage), '_blank', 'noopener,noreferrer')
          }}
        >
          <h3 id={`${uid}-title`}>WhatsApp enquiry</h3>
          <p className="fine">
            Fill in what you know — everything is optional. Your message opens in WhatsApp, where you can edit it
            before sending.
          </p>

          <div className="field-row">
            <div className="field">
              <label htmlFor={`${uid}-occasion`}>Occasion</label>
              <select id={`${uid}-occasion`} value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                <option value="">Select (optional)</option>
                {OCCASIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor={`${uid}-date`}>Event date</label>
              <input id={`${uid}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor={`${uid}-venue`}>Venue / area</label>
            <input
              id={`${uid}-venue`}
              type="text"
              autoComplete="off"
              placeholder="e.g. function hall name or town"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor={`${uid}-msg`}>Message</label>
            <textarea id={`${uid}-msg`} rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-gold btn-lg btn-block">
            <WhatsAppIcon width={20} height={20} />
            Continue in WhatsApp
            <span className="sr-only">(opens in a new tab)</span>
          </button>
          <p className="fine center">Sending an enquiry does not confirm a booking.</p>
        </form>
      </div>
    </section>
  )
}
