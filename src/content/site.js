// Business details and copy. Edit here — every component reads from this file.
// Source for services, location and opening date: the SKANDA EVENTS shop-opening invitation.

export const BUSINESS = {
  name: 'SKANDA EVENTS',
  tagline: 'Make your moments extra special',
  phones: [
    { display: '93910 76007', tel: '+919391076007', raw: '9391076007' },
    { display: '83106 13117', tel: '+918310613117', raw: '8310613117' },
  ],
  // WhatsApp enquiries. `number` = country code + number, no spaces or "+".
  whatsapp: { number: '918310613117', display: '83106 13117' },
  // Full Instagram profile URL, e.g. 'https://www.instagram.com/skanda_events/'. Leave '' to hide all Instagram links.
  instagram: 'https://www.instagram.com/skanda_events_01/',
  location: {
    line1: 'Near SLV Mandapam',
    line2: 'Badumakulapalli, Santhipuram',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('SLV Mandapam, Badumakulapalli, Santhipuram'),
  },
  // Shown as a small announcement in the hero until the end of this date (local time), then hidden automatically.
  shopOpening: { date: '2026-10-25', label: '25 October 2026' },
}

export const DEFAULT_ENQUIRY =
  'Hello SKANDA EVENTS, I would like to enquire about your services for an upcoming event. Please share availability and details.'

export const whatsappLink = (message = DEFAULT_ENQUIRY) =>
  `https://wa.me/${BUSINESS.whatsapp.number}?text=${encodeURIComponent(message)}`

// "@handle" derived from the Instagram URL, for display.
export const instagramHandle = () => {
  const m = BUSINESS.instagram.match(/instagram\.com\/([^/?#]+)/i)
  return m ? `@${m[1]}` : 'Instagram'
}

export const NAV = [
  { id: 'services', label: 'Services' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

// Round badge photo for each service card, first match wins:
//   1. media/services/<id>.jpg   2. `photo` (a specific gallery file)   3. first photo in the `gallery` category
// `gallery` also powers the card's "See photos" link.
export const SERVICES = [
  {
    id: 'theme-decoration',
    title: 'Theme Decoration',
    text: 'Themed décor and stage styling for celebrations and functions, planned around your venue and the mood you want.',
    enquiry: 'theme decoration',
    icon: 'stage',
    gallery: 'decoration',
    photo: 'gallery/birthdays/02-white-maroon-balloon-ring.jpg',
  },
  {
    id: 'balloon-decor',
    title: 'Balloon Décor',
    text: 'Balloon arches, garlands and backdrops in the colours of your theme.',
    enquiry: 'balloon décor',
    icon: 'balloon',
  },
  {
    id: 'birthdays',
    title: 'Birthday Party Set-ups',
    text: 'Birthday set-ups and backdrops styled around the theme you have in mind, ready for the cake-cutting and the photos.',
    enquiry: 'a birthday party set-up',
    icon: 'cake',
    gallery: 'birthdays',
  },
  {
    id: 'weddings',
    title: 'Wedding & Special Events',
    text: 'Set-ups and entries for weddings and other special occasions, designed to make the big moments feel grand.',
    enquiry: 'a wedding / special event',
    icon: 'rings',
    gallery: 'weddings',
  },
  {
    id: 'effects',
    title: 'Cold Pyro, Spark & Smoke Entries',
    text: 'Cold pyro, spark and smoke effects for grand entries and highlight moments, planned to suit venue rules and permissions.',
    enquiry: 'cold pyro / spark / smoke entry',
    icon: 'spark',
    gallery: 'fireworks-effects',
  },
  {
    id: 'mascots',
    title: 'Mascot Characters',
    text: 'Costumed mascot characters to bring extra fun to birthdays and family celebrations.',
    enquiry: 'mascot characters',
    icon: 'mascot',
  },
]

export const OCCASIONS = [
  'Birthday party set-up',
  'Theme decoration',
  'Balloon décor',
  'Wedding / special event',
  'Cold pyro / spark / smoke entry',
  'Mascot characters',
  'Other',
]
