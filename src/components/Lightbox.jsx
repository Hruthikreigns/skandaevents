import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, CloseIcon } from './Icons'
import Picture from './Picture'

/** Accessible photo viewer built on the native modal <dialog> (focus trap + Esc handled by the browser). */
export default function Lightbox({ photos, index, setIndex, onClose, labelFor }) {
  const ref = useRef(null)
  const touch = useRef(null)
  const photo = photos[index]
  const many = photos.length > 1

  const go = (delta) => setIndex((i) => (i + delta + photos.length) % photos.length)

  useEffect(() => {
    const dlg = ref.current
    if (!dlg.open) dlg.showModal()
    document.body.classList.add('menu-open')
    return () => document.body.classList.remove('menu-open')
  }, [])

  useEffect(() => {
    // Warm the neighbours so next/previous feel instant.
    if (!many) return
    ;[photos[(index + 1) % photos.length], photos[(index - 1 + photos.length) % photos.length]].forEach((p) => {
      const img = new Image()
      img.sizes = '100vw'
      img.srcset = p.webpSrcSet || p.srcSet
      img.src = p.src
    })
  }, [index, photos, many])

  const onKeyDown = (e) => {
    if (!many) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') touch.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e) => {
    const start = touch.current
    touch.current = null
    if (!start || !many) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
  }

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Photo viewer"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => (e.target === ref.current || e.target.classList.contains('lightbox-inner')) && onClose()}
      onKeyDown={onKeyDown}
    >
      <div className="lightbox-inner">
        <div className="lightbox-bar">
          <p className="lightbox-count" aria-live="polite" aria-atomic="true">
            {labelFor(photo.category)} · {index + 1} / {photos.length}
          </p>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close photo viewer" autoFocus>
            <CloseIcon width={22} height={22} />
          </button>
        </div>

        <figure className="lightbox-figure" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <Picture key={photo.id} image={photo} sizes="100vw" priority imgClassName="lightbox-img" />
          <figcaption>{photo.alt}</figcaption>
        </figure>

        {many && (
          <>
            <button type="button" className="icon-btn lightbox-nav prev" onClick={() => go(-1)} aria-label="Previous photo">
              <ChevronLeft width={26} height={26} />
            </button>
            <button type="button" className="icon-btn lightbox-nav next" onClick={() => go(1)} aria-label="Next photo">
              <ChevronRight width={26} height={26} />
            </button>
          </>
        )}
      </div>
    </dialog>
  )
}
