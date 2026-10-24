import { useEffect, useRef, useState } from 'react'
import { BUSINESS, instagramHandle, whatsappLink } from '../content/site'
import { media } from '../lib/media'
import useActiveSection from '../lib/useActiveSection'
import { CameraIcon, CloseIcon, MenuIcon, WhatsAppIcon } from './Icons'
import Picture from './Picture'

export default function Header({ nav }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(nav.map((n) => n.id))
  const toggleRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onResize = () => window.innerWidth > 900 && setOpen(false)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    document.body.classList.add('menu-open')
    panelRef.current?.querySelector('a')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      document.body.classList.remove('menu-open')
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`site-header${scrolled || open ? ' is-solid' : ''}`}>
      <div className="container header-inner">
        <a className="brand" href="#top" onClick={close} aria-label={`${BUSINESS.name} — back to top`}>
          {media.logo ? (
            <Picture image={media.logo} sizes="96px" alt="" imgClassName="brand-logo" priority />
          ) : null}
          <span className="brand-name">{BUSINESS.name}</span>
        </a>

        <nav className="desktop-nav" aria-label="Main">
          <ul>
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="btn btn-gold btn-sm header-cta" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon width={18} height={18} />
          <span>WhatsApp</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
        </button>
      </div>

      <div id="mobile-menu" ref={panelRef} className={`mobile-menu${open ? ' is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={close}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu-actions">
          <a className="btn btn-gold" href={whatsappLink()} target="_blank" rel="noopener noreferrer" onClick={close}>
            <WhatsAppIcon width={18} height={18} /> Enquire on WhatsApp
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          {BUSINESS.phones.map((p) => (
            <a key={p.tel} className="btn btn-ghost" href={`tel:${p.tel}`} onClick={close}>
              Call {p.display}
            </a>
          ))}
          {BUSINESS.instagram && (
            <a className="btn btn-ghost" href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" onClick={close}>
              <CameraIcon width={18} height={18} /> Instagram {instagramHandle()}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
