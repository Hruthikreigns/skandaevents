import { BUSINESS, whatsappLink } from '../content/site'
import { media } from '../lib/media'
import GoldAccent from './GoldAccent'
import { ArrowDown, WhatsAppIcon } from './Icons'
import Picture from './Picture'

// Evaluated once when the page loads; the notice disappears after the opening day.
const SHOW_OPENING = Date.now() <= new Date(`${BUSINESS.shopOpening.date}T23:59:59`).getTime()

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      {media.hero && (
        <div className="hero-backdrop" aria-hidden="true">
          <Picture image={media.hero} alt="" sizes="100vw" priority imgClassName="hero-backdrop-img" />
        </div>
      )}
      <div className="hero-glow" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-mark">
          <GoldAccent />
          {media.logo ? (
            <Picture
              image={media.logo}
              alt={`${BUSINESS.name} logo`}
              sizes="(max-width: 640px) 70vw, 420px"
              priority
              className="hero-logo"
              imgClassName="hero-logo-img"
            />
          ) : (
            <p className="hero-wordmark" aria-hidden="true">
              SKANDA
              <span>EVENTS</span>
            </p>
          )}
        </div>

        <div className="hero-copy">
          {SHOW_OPENING && (
            <p className="opening-pill">
              <span className="dot" aria-hidden="true" />
              Shop opening · {BUSINESS.shopOpening.label} · All are welcome ·{' '}
              <a href="#about">See invitation</a>
            </p>
          )}
          <p className="eyebrow">{BUSINESS.tagline}</p>
          <h1 id="hero-title">
            Celebrations styled to be <em>remembered</em>
          </h1>
          <p className="lede">
            Event decoration, birthday set-ups, wedding stages and entries, and special effects — designed with care
            so your occasion looks and feels special.
          </p>
          <div className="hero-actions">
            <a className="btn btn-gold btn-lg" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon width={20} height={20} />
              Enquire on WhatsApp
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a className="btn btn-ghost btn-lg" href="#services">
              Explore Services
              <ArrowDown width={18} height={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
