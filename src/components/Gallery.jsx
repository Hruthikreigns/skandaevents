import { useMemo, useRef, useState } from 'react'
import { media } from '../lib/media'
import Lightbox from './Lightbox'
import Picture from './Picture'

export default function Gallery({ filter, setFilter }) {
  const [openIndex, setOpenIndex] = useState(-1)
  const triggerRefs = useRef([])

  const photos = useMemo(
    () => (filter === 'all' ? media.gallery : media.gallery.filter((p) => p.category === filter)),
    [filter],
  )
  const labelFor = (id) => media.categories.find((c) => c.id === id)?.label ?? ''
  const filters = media.categories.length > 1 ? [{ id: 'all', label: 'All' }, ...media.categories] : []

  const close = () => {
    const i = openIndex
    setOpenIndex(-1)
    requestAnimationFrame(() => triggerRefs.current[i]?.focus())
  }

  return (
    <section className="section gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Set-ups &amp; effects</p>
          <h2 id="gallery-title">Gallery</h2>
          <p className="section-lede">Set-ups and effects for birthdays, weddings and grand entries. Tap a photo to view it larger.</p>
        </header>

        {filters.length > 0 && (
          <div className="filters" role="group" aria-label="Filter photos by category">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className="chip"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          Showing {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          {filter !== 'all' ? ` in ${labelFor(filter)}` : ''}.
        </p>

        <ul className="masonry">
          {photos.map((p, i) => (
            <li key={p.id} className="masonry-item">
              <button
                type="button"
                ref={(el) => (triggerRefs.current[i] = el)}
                className="photo-button"
                onClick={() => setOpenIndex(i)}
                aria-haspopup="dialog"
              >
                <Picture
                  image={p}
                  sizes="(max-width: 640px) 92vw, (max-width: 1100px) 46vw, 420px"
                  imgClassName="photo-img"
                />
                <span className="photo-tag" aria-hidden="true">
                  {labelFor(p.category)}
                </span>
                <span className="sr-only">
                  {`— ${labelFor(p.category)}. Open larger view, photo ${i + 1} of ${photos.length}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {openIndex > -1 && (
        <Lightbox
          photos={photos}
          index={openIndex}
          setIndex={setOpenIndex}
          onClose={close}
          labelFor={labelFor}
        />
      )}
    </section>
  )
}
