import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './PillLinks.css'

/**
 * PillLinks — the pill/circle-fill hover effect from the FROSH stellar site's
 * PillNav component, adapted to drop into this app's existing Navbar.
 * Only renders the link list itself; logo, profile menu, and the mobile
 * hamburger/menu stay exactly as they were in Navbar.jsx.
 */
export default function PillLinks({ items, activeSection, ease = 'power3.easeOut' }) {
  const circleRefs = useRef([])
  const tlRefs = useRef([])
  const activeTweenRefs = useRef([])
  const listRef = useRef(null)

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return
        const pill = circle.parentElement
        const rect = pill.getBoundingClientRect()
        const { width: w, height: h } = rect
        if (!w || !h) return

        const R = ((w * w) / 4 + h * h) / (2 * h)
        const D = Math.ceil(2 * R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        const originY = D - delta

        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` })

        const label = pill.querySelector('.pill-label')
        const white = pill.querySelector('.pill-label-hover')
        if (label) gsap.set(label, { y: 0 })
        if (white) gsap.set(white, { y: h + 12, opacity: 0 })

        tlRefs.current[index]?.kill()
        const tl = gsap.timeline({ paused: true })
        // Slight overshoot (1.35x) so the fill always fully covers the pill,
        // including its rounded corners, instead of stopping just short of the edge.
        tl.to(circle, { scale: 1.35, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0)
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0)
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 })
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0)
        }
        tlRefs.current[index] = tl
      })
    }

    // Run once immediately, then again after the browser has actually painted
    // the pills (padding/font can shift sizes by a frame on first mount).
    layout()
    const raf = requestAnimationFrame(layout)

    window.addEventListener('resize', layout)
    if (document.fonts?.ready) document.fonts.ready.then(layout).catch(() => {})

    // Catches any layout shift a plain window resize listener would miss
    // (e.g. the nav's own width settling after fonts/icons load).
    let ro
    if (listRef.current && 'ResizeObserver' in window) {
      ro = new ResizeObserver(() => layout())
      ro.observe(listRef.current)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', layout)
      ro?.disconnect()
    }
  }, [items, ease])

  const handleEnter = i => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' })
  }

  const handleLeave = i => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' })
  }

  return (
    <ul className="pill-list" role="menubar" ref={listRef}>
      {items.map((item, i) => (
        <li key={item.name} role="none">
          <a
            role="menuitem"
            href={item.to}
            className={`pill${activeSection === item.section ? ' is-active' : ''}`}
            aria-label={item.name}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={() => handleLeave(i)}
            onClick={item.onClick}
          >
            <span className="hover-circle" aria-hidden="true" ref={el => { circleRefs.current[i] = el }} />
            <span className="label-stack">
              <span className="pill-label">{item.name}</span>
              <span className="pill-label-hover" aria-hidden="true">{item.name}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
