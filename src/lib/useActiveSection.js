import { useEffect, useState } from 'react'

export default function useActiveSection(ids) {
  const [active, setActive] = useState('')
  const key = ids.join(',')

  useEffect(() => {
    const els = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!els.length || !('IntersectionObserver' in window)) return
    const visible = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting))
        const current = els.find((el) => visible.get(el.id))
        setActive(current ? current.id : '')
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])

  return active
}
