// Lightweight Three.js accent: a slowly turning gold ring with drifting light motes.
// Loaded lazily after the page is interactive; never blocks content.
import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  WebGLRenderer,
} from 'three'

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,240,200,1)')
  grad.addColorStop(0.35, 'rgba(233,200,120,0.55)')
  grad.addColorStop(1, 'rgba(233,200,120,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new CanvasTexture(c)
}

export function mountGoldScene(canvas, { animate = true } = {}) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.set(0, 0, 9)

  scene.add(new AmbientLight(0xffffff, 0.35))
  const key = new DirectionalLight(0xfff1d0, 2.2)
  key.position.set(3, 4, 6)
  scene.add(key)
  const rim = new PointLight(0xd4a24c, 30, 20)
  rim.position.set(-4, -2, 3)
  scene.add(rim)

  const ringGroup = new Group()
  const gold = new MeshStandardMaterial({ color: new Color('#d4af61'), metalness: 1, roughness: 0.28 })
  const ring = new Mesh(new TorusGeometry(2.6, 0.035, 24, 220), gold)
  const ring2 = new Mesh(
    new TorusGeometry(2.95, 0.012, 16, 220),
    new MeshStandardMaterial({ color: new Color('#b8913f'), metalness: 1, roughness: 0.4 }),
  )
  ringGroup.add(ring, ring2)
  ringGroup.rotation.x = 1.15
  scene.add(ringGroup)

  const count = window.innerWidth < 700 ? 90 : 180
  const positions = new Float32Array(count * 3)
  const speeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const r = 1.5 + Math.random() * 3.5
    const a = Math.random() * Math.PI * 2
    positions[i * 3] = Math.cos(a) * r
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6
    positions[i * 3 + 2] = Math.sin(a) * r - 1
    speeds[i] = 0.08 + Math.random() * 0.22
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(positions, 3))
  const tex = glowTexture()
  const motes = new Points(
    geo,
    new PointsMaterial({
      size: 0.12,
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      color: new Color('#f2d89a'),
      opacity: 0.85,
    }),
  )
  scene.add(motes)

  let raf = 0
  let running = false
  let last = performance.now()

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.position.z = w / h < 0.8 ? 12 : 9
    camera.updateProjectionMatrix()
    if (!running) renderer.render(scene, camera)
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  const frame = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    ringGroup.rotation.z += dt * 0.12
    ringGroup.rotation.y = Math.sin(now / 4000) * 0.12
    const p = geo.attributes.position.array
    for (let i = 0; i < count; i++) {
      p[i * 3 + 1] += speeds[i] * dt
      if (p[i * 3 + 1] > 3) p[i * 3 + 1] = -3
    }
    geo.attributes.position.needsUpdate = true
    renderer.render(scene, camera)
    if (running) raf = requestAnimationFrame(frame)
  }

  const start = () => {
    if (running || !animate) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  renderer.render(scene, camera) // static first frame (also the reduced-motion view)

  const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()))
  io.observe(canvas)
  const onVis = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVis)

  return () => {
    stop()
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', onVis)
    geo.dispose()
    tex.dispose()
    gold.dispose()
    renderer.dispose()
  }
}
