import { useState } from 'react'
import { media } from '../lib/media'

/** Development-only reminder of which business photos are still missing. Never shipped in production builds. */
export default function MediaNotice() {
  const [hidden, setHidden] = useState(false)
  const missing = [
    !media.logo && 'media/logo/ — the SKANDA EVENTS logo (PNG with transparency or SVG)',
    !media.invitation.length && 'media/invitation/ — the shop-opening invitation',
    !media.gallery.length &&
      'media/gallery/{decoration,birthdays,weddings,fireworks-effects}/ — event photos (the Gallery section appears once photos exist)',
  ].filter(Boolean)
  if (hidden || !missing.length) return null
  return (
    <aside className="dev-notice" aria-label="Developer notice">
      <strong>Dev only — add your images:</strong>
      <ul>
        {missing.map((m) => (
          <li key={m}>
            <code>{m}</code>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => setHidden(true)}>
        Dismiss
      </button>
    </aside>
  )
}
