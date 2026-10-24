/**
 * Builds responsive, web-optimised copies of the business photos and logo.
 *
 *   media/                       ← put ORIGINAL, full-resolution files here
 *     logo/                      ← the SKANDA EVENTS logo (PNG with transparency preferred, or SVG)
 *     hero/                      ← optional: one photo to use as the hero backdrop
 *     invitation/                ← the shop-opening invitation
 *     gallery/<category>/        ← event photos (decoration, birthdays, weddings, fireworks-effects)
 *     services/<service-id>.jpg  ← optional: a photo for one service card's round badge (e.g. mascots.jpg)
 *     captions.json              ← optional: { "gallery/weddings/IMG_01.jpg": "Describe the photo" }
 *
 * Output: public/media/** (resized WebP + JPEG/PNG fallbacks, never upscaled)
 *         public/media/icons/** (favicons + social image made from the untouched logo)
 *         src/content/media-manifest.json (consumed by the React app)
 *
 * Runs automatically before `npm run dev` / `npm run build` via the Vite plugin,
 * and can be run by hand with `npm run media`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MEDIA_DIR = path.join(ROOT, 'media')
const OUT_DIR = path.join(ROOT, 'public', 'media')
const MANIFEST = path.join(ROOT, 'src', 'content', 'media-manifest.json')
const CACHE_FILE = path.join(OUT_DIR, '.cache.json')
const VERSION = 4

const RASTER = /\.(jpe?g|png|webp|avif|tiff?)$/i
const PHOTO_WIDTHS = [480, 800, 1200, 1600, 2400, 3200, 3840]
const LOGO_WIDTHS = [160, 320, 480, 640, 960, 1280, 1600]

export const GALLERY_CATEGORIES = [
  { id: 'decoration', label: 'Event Decoration' },
  { id: 'birthdays', label: 'Birthdays' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'fireworks-effects', label: 'Spark & Effects' },
]

const DEFAULT_ALT = {
  logo: 'SKANDA EVENTS logo',
  hero: 'Event set-up by SKANDA EVENTS',
  invitation: 'SKANDA EVENTS shop-opening invitation',
  decoration: 'Event decoration by SKANDA EVENTS',
  birthdays: 'Birthday celebration set-up by SKANDA EVENTS',
  weddings: 'Wedding set-up by SKANDA EVENTS',
  service: 'SKANDA EVENTS service',
  'fireworks-effects': 'Spark and special-effects entry by SKANDA EVENTS',
}

const slug = (s) =>
  s.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'image'

const listImages = (dir, allowSvg = false) => {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => !f.startsWith('.') && (RASTER.test(f) || (allowSvg && /\.svg$/i.test(f))))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => path.join(dir, f))
}

const pickWidths = (original, ladder) => {
  const widths = ladder.filter((w) => w < original)
  const capped = Math.min(original, ladder[ladder.length - 1])
  if (!widths.length || capped - widths[widths.length - 1] > capped * 0.1) widths.push(capped)
  return widths
}

const readJson = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

const rel = (file) => path.relative(MEDIA_DIR, file).split(path.sep).join('/')
const url = (file) => '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/')

async function processRaster(file, group, { isLogo = false } = {}) {
  const base = sharp(file, { failOn: 'none' }).rotate()
  const meta = await base.metadata()
  // metadata() reports pre-rotation size; swap for EXIF orientations 5–8.
  const swap = (meta.orientation ?? 1) >= 5
  const width = swap ? meta.height : meta.width
  const height = swap ? meta.width : meta.height
  const hasAlpha = Boolean(meta.hasAlpha)
  const fallbackExt = isLogo || hasAlpha ? 'png' : 'jpg'
  const outDir = path.join(OUT_DIR, group)
  fs.mkdirSync(outDir, { recursive: true })
  const name = slug(path.basename(file))
  const widths = pickWidths(width, isLogo ? LOGO_WIDTHS : PHOTO_WIDTHS)

  const webp = []
  const fallback = []
  for (const w of widths) {
    const resized = sharp(file, { failOn: 'none' }).rotate().resize({ width: w, withoutEnlargement: true })
    const webpFile = path.join(outDir, `${name}-${w}.webp`)
    await resized.clone().webp({ quality: isLogo ? 85 : 80, alphaQuality: 100, effort: 5 }).toFile(webpFile)
    webp.push({ file: webpFile, w })
    const fbFile = path.join(outDir, `${name}-${w}.${fallbackExt}`)
    if (fallbackExt === 'png') await resized.clone().png({ compressionLevel: 9 }).toFile(fbFile)
    else await resized.clone().jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(fbFile)
    fallback.push({ file: fbFile, w })
  }

  const { dominant } = await sharp(file, { failOn: 'none' }).resize(64).stats()
  const mid = fallback.find((f) => f.w >= 1200) ?? fallback[fallback.length - 1]

  return {
    width,
    height,
    color: hasAlpha ? null : `rgb(${dominant.r} ${dominant.g} ${dominant.b})`,
    src: url(mid.file),
    srcSet: fallback.map((f) => `${url(f.file)} ${f.w}w`).join(', '),
    webpSrcSet: webp.map((f) => `${url(f.file)} ${f.w}w`).join(', '),
    fallbackType: fallbackExt === 'png' ? 'image/png' : 'image/jpeg',
    largest: url(fallback[fallback.length - 1].file),
    outputs: [...webp, ...fallback].map((f) => f.file),
  }
}

async function processSvg(file, group) {
  const outDir = path.join(OUT_DIR, group)
  fs.mkdirSync(outDir, { recursive: true })
  const out = path.join(outDir, path.basename(file).toLowerCase())
  fs.copyFileSync(file, out)
  const meta = await sharp(file).metadata()
  return {
    width: meta.width,
    height: meta.height,
    color: null,
    src: url(out),
    srcSet: '',
    webpSrcSet: '',
    fallbackType: 'image/svg+xml',
    largest: url(out),
    outputs: [out],
  }
}

async function buildIcons(logoFile) {
  const dir = path.join(OUT_DIR, 'icons')
  fs.mkdirSync(dir, { recursive: true })
  const transparent = { r: 0, g: 0, b: 0, alpha: 0 }
  const black = { r: 11, g: 10, b: 8, alpha: 1 }
  const square = (size, background, pad) =>
    sharp(logoFile, { density: 400 })
      .rotate()
      .resize({ width: size - pad * 2, height: size - pad * 2, fit: 'contain', background: transparent })
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: transparent })
      .flatten(background.alpha === 1 ? { background } : false)

  const files = {
    favicon32: path.join(dir, 'favicon-32.png'),
    favicon192: path.join(dir, 'icon-192.png'),
    apple: path.join(dir, 'apple-touch-icon.png'),
    og: path.join(dir, 'og-image.jpg'),
  }
  await square(32, transparent, 0).png().toFile(files.favicon32)
  await square(192, transparent, 8).png().toFile(files.favicon192)
  await square(180, black, 16).png().toFile(files.apple)

  // Social preview: the logo, unaltered and contained, centred on the brand black.
  const logoBuf = await sharp(logoFile, { density: 400 })
    .rotate()
    .resize({ width: 1000, height: 480, fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer()
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: black } })
    .composite([{ input: logoBuf, gravity: 'centre' }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(files.og)

  return Object.fromEntries(Object.entries(files).map(([k, f]) => [k, url(f)]))
}

export async function buildMedia({ log = console.log } = {}) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const captions = readJson(path.join(MEDIA_DIR, 'captions.json'), {})
  const cache = readJson(CACHE_FILE, {})
  const nextCache = {}
  const keep = new Set([CACHE_FILE])
  let processed = 0

  const handle = async (file, group, altKey, opts = {}) => {
    const stat = fs.statSync(file)
    const key = `${VERSION}:${stat.size}:${stat.mtimeMs}`
    const id = rel(file)
    let entry = cache[id]
    if (!entry || entry.key !== key || !entry.outputs.every((o) => fs.existsSync(o))) {
      entry = { key, ...(/\.svg$/i.test(file) ? await processSvg(file, group) : await processRaster(file, group, opts)) }
      processed++
    }
    nextCache[id] = entry
    entry.outputs.forEach((o) => keep.add(o))
    const { key: _k, outputs: _o, ...pub } = entry
    return { id, alt: captions[id] || DEFAULT_ALT[altKey], ...pub }
  }

  const logoFiles = listImages(path.join(MEDIA_DIR, 'logo'), true)
  const logoFile = logoFiles.find((f) => /logo/i.test(path.basename(f))) ?? logoFiles[0]
  const logo = logoFile ? await handle(logoFile, 'logo', 'logo', { isLogo: true }) : null

  const hero = []
  for (const f of listImages(path.join(MEDIA_DIR, 'hero')).slice(0, 1)) hero.push(await handle(f, 'hero', 'hero'))

  const invitation = []
  for (const f of listImages(path.join(MEDIA_DIR, 'invitation'))) invitation.push(await handle(f, 'invitation', 'invitation'))

  const gallery = []
  for (const cat of GALLERY_CATEGORIES) {
    for (const f of listImages(path.join(MEDIA_DIR, 'gallery', cat.id))) {
      gallery.push({ category: cat.id, ...(await handle(f, `gallery/${cat.id}`, cat.id)) })
    }
  }

  // Service-card badges: media/services/<service-id>.<ext> (ids are in src/content/site.js)
  const services = {}
  for (const f of listImages(path.join(MEDIA_DIR, 'services'))) {
    services[slug(path.basename(f))] = await handle(f, 'services', 'service')
  }

  let icons = null
  if (logoFile) {
    const iconKey = nextCache[rel(logoFile)].key
    const iconDir = path.join(OUT_DIR, 'icons')
    if (cache.__icons?.key === iconKey && cache.__icons.outputs.every((o) => fs.existsSync(path.join(ROOT, 'public', o)))) {
      icons = cache.__icons.icons
    } else {
      icons = await buildIcons(logoFile)
    }
    nextCache.__icons = { key: iconKey, icons, outputs: Object.values(icons) }
    fs.readdirSync(iconDir).forEach((f) => keep.add(path.join(iconDir, f)))
  }

  // Remove generated files whose originals were deleted or renamed.
  const sweep = (dir) => {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f)
      if (fs.statSync(p).isDirectory()) {
        sweep(p)
        if (!fs.readdirSync(p).length) fs.rmdirSync(p)
      } else if (!keep.has(p)) fs.unlinkSync(p)
    }
  }
  sweep(OUT_DIR)

  fs.writeFileSync(CACHE_FILE, JSON.stringify(nextCache))
  const manifest = {
    categories: GALLERY_CATEGORIES.filter((c) => gallery.some((g) => g.category === c.id)),
    logo,
    hero: hero[0] ?? null,
    invitation,
    gallery,
    services,
    icons,
  }
  const json = JSON.stringify(manifest, null, 2) + '\n'
  if (!fs.existsSync(MANIFEST) || fs.readFileSync(MANIFEST, 'utf8') !== json) fs.writeFileSync(MANIFEST, json)

  log(
    `[media] logo: ${logo ? 'yes' : 'missing'}, hero: ${hero.length}, invitation: ${invitation.length}, ` +
      `gallery: ${gallery.length}${processed ? ` (${processed} processed)` : ''}`,
  )
  return manifest
}

export const MEDIA_ROOT = MEDIA_DIR

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  buildMedia().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
