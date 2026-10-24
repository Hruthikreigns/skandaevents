import { useState } from 'react'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Gallery from './components/Gallery'
import Header from './components/Header'
import Hero from './components/Hero'
import { WhatsAppIcon } from './components/Icons'
import MediaNotice from './components/MediaNotice'
import Services from './components/Services'
import { NAV, whatsappLink } from './content/site'
import { media } from './lib/media'

const hasGallery = media.gallery.length > 0
// Sections without real content are left out (and dropped from navigation) rather than shown empty.
const nav = NAV.filter((n) => n.id !== 'gallery' || hasGallery)

export default function App() {
  const [galleryFilter, setGalleryFilter] = useState('all')

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header nav={nav} />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Services showGalleryLinks={hasGallery} onViewCategory={setGalleryFilter} />
        {hasGallery && <Gallery filter={galleryFilter} setFilter={setGalleryFilter} />}
        <About />
        <Contact />
      </main>
      <Footer nav={nav} />
      <a className="wa-float" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Enquire on WhatsApp (opens in a new tab)">
        <WhatsAppIcon width={28} height={28} />
      </a>
      {import.meta.env.DEV && <MediaNotice />}
    </>
  )
}
