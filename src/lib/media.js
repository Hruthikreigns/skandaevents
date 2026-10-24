import manifest from '../content/media-manifest.json'

// The media pipeline writes root-relative URLs ("/media/…"); serve them from the deploy base
// so the site also works in a sub-folder (e.g. GitHub Pages: /skanda-events/).
const BASE = import.meta.env.BASE_URL
const rebase = (img) =>
  img && {
    ...img,
    src: img.src.replace(/^\//, BASE),
    largest: img.largest?.replace(/^\//, BASE),
    srcSet: img.srcSet.replace(/(^|, )\//g, `$1${BASE}`),
    webpSrcSet: img.webpSrcSet.replace(/(^|, )\//g, `$1${BASE}`),
  }

export const media = {
  ...manifest,
  logo: rebase(manifest.logo),
  hero: rebase(manifest.hero),
  invitation: manifest.invitation.map(rebase),
  gallery: manifest.gallery.map(rebase),
  services: Object.fromEntries(Object.entries(manifest.services ?? {}).map(([k, v]) => [k, rebase(v)])),
}

export const hasLogo = Boolean(media.logo)
export const photosFor = (category) => media.gallery.filter((p) => p.category === category)

export const servicePhoto = (service) =>
  media.services[service.id] ??
  (service.photo && media.gallery.find((p) => p.id === service.photo)) ??
  (service.gallery ? photosFor(service.gallery)[0] : null) ??
  null
