import { BUSINESS, instagramHandle, whatsappLink } from '../content/site'
import { media } from '../lib/media'
import { CameraIcon, WhatsAppIcon } from './Icons'
import Picture from './Picture'

const YEAR = new Date().getFullYear()

export default function Footer({ nav }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          {media.logo && <Picture image={media.logo} alt={`${BUSINESS.name} logo`} sizes="120px" className="footer-logo" />}
          <p className="footer-name">{BUSINESS.name}</p>
          <p className="fine">{BUSINESS.tagline}</p>
          <address className="fine footer-address">
            {BUSINESS.location.line1}
            <br />
            {BUSINESS.location.line2}
          </address>
        </div>

        <nav aria-label="Footer">
          <h2 className="footer-heading">Explore</h2>
          <ul className="footer-links">
            <li>
              <a href="#top">Home</a>
            </li>
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="footer-heading">Contact</h2>
          <ul className="footer-links">
            {BUSINESS.phones.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`}>
                  Call {p.display}
                </a>
              </li>
            ))}
            <li>
              <a href={BUSINESS.location.mapsUrl} target="_blank" rel="noopener noreferrer">
                Directions<span className="sr-only"> on Google Maps (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a className="footer-wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon width={16} height={16} /> WhatsApp enquiry
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            {BUSINESS.instagram && (
              <li>
                <a className="footer-wa" href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer">
                  <CameraIcon width={16} height={16} /> Instagram {instagramHandle()}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {YEAR} {BUSINESS.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
