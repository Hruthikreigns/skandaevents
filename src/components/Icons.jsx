// Small inline icons (decorative: aria-hidden). Text labels always accompany them.
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
}

export const WhatsAppIcon = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none" viewBox="0 0 24 24">
    <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01Zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.23 8.22Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
  </svg>
)

export const PhoneIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 5 5l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
)

export const MenuIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const ChevronLeft = (p) => (
  <svg {...base} {...p}>
    <path d="m15 5-7 7 7 7" />
  </svg>
)

export const ChevronRight = (p) => (
  <svg {...base} {...p}>
    <path d="m9 5 7 7-7 7" />
  </svg>
)

export const CameraIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13" r="3.6" />
  </svg>
)

export const PinIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)

export const ArrowDown = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
)

const serviceIcons = {
  stage: (
    <>
      <path d="M3 20h18M5 20V9M19 20V9" />
      <path d="M3 9c3 0 4-4 9-4s6 4 9 4" />
      <path d="M8 20v-5h8v5" />
    </>
  ),
  cake: (
    <>
      <path d="M4 20h16M5 20v-7h14v7" />
      <path d="M5 16c2 0 2 1.5 3.5 1.5S10 16 12 16s2 1.5 3.5 1.5S17 16 19 16" />
      <path d="M12 13V9M12 6.5c.8-.8.8-1.7 0-2.5-.8.8-.8 1.7 0 2.5Z" />
    </>
  ),
  rings: (
    <>
      <circle cx="9" cy="14" r="5" />
      <circle cx="15" cy="14" r="5" />
      <path d="m10 6 2-3 2 3" />
    </>
  ),
  balloon: (
    <>
      <ellipse cx="9" cy="8.5" rx="4.2" ry="5" />
      <ellipse cx="15.5" cy="10" rx="3.6" ry="4.4" />
      <path d="M9 13.5c0 2-1 3.5 0 5.5M15.5 14.4c0 2 .8 3 0 4.6" />
    </>
  ),
  mascot: (
    <>
      <path d="M9 9.5C8 6 8 3.5 9.3 3.2s2 2.8 1.9 6.1M15 9.5c1-3.5 1-6-.3-6.3s-2 2.8-1.9 6.1" />
      <circle cx="12" cy="14.5" r="5.5" />
      <path d="M10 13.6h.01M14 13.6h.01M10.6 16.6c.8.6 2 .6 2.8 0" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
      <circle cx="12" cy="12" r="1.6" />
    </>
  ),
}

export const ServiceIcon = ({ name, ...p }) => (
  <svg {...base} width={28} height={28} strokeWidth={1.3} {...p}>
    {serviceIcons[name]}
  </svg>
)
