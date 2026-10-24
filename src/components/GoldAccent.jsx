import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

const supportsWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return Boolean(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

/** Decorative WebGL layer. Loads after the page is idle; the CSS glow behind it is the fallback. */
export default function GoldAccent() {
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const conn = navigator.connection
    if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? '')) return
    if (!supportsWebGL()) return
    let cleanup = () => {}
    let cancelled = false
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 600))
    const cancelIdle = window.cancelIdleCallback ?? clearTimeout
    const handle = idle(
      async () => {
        try {
          const { mountGoldScene } = await import('./goldScene.js')
          if (cancelled || !canvasRef.current) return
          cleanup = mountGoldScene(canvasRef.current, { animate: !prefersReducedMotion() })
          setReady(true)
        } catch {
          // WebGL context creation can still fail (blocked GPU, etc.) — the CSS glow remains.
        }
      },
      { timeout: 2500 },
    )
    return () => {
      cancelled = true
      cancelIdle(handle)
      cleanup()
    }
  }, [])

  return <canvas ref={canvasRef} className={`gold-canvas${ready ? ' is-ready' : ''}`} aria-hidden="true" />
}
