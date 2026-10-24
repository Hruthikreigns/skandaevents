import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { buildMedia, MEDIA_ROOT } from './scripts/build-media.mjs'
import { BUSINESS } from './src/content/site.js'

/**
 * Optimises everything in /media before dev/build, re-runs when files there change,
 * and injects logo-based favicons + social preview tags into index.html when a logo exists.
 */
function skandaMedia(siteUrl) {
  let manifest = null
  let base = '/'
  return {
    name: 'skanda-media',
    configResolved(config) {
      base = config.base
    },
    async buildStart() {
      manifest = await buildMedia()
    },
    configureServer(server) {
      let timer
      server.watcher.add(MEDIA_ROOT)
      const rebuild = (file) => {
        if (!file.startsWith(MEDIA_ROOT)) return
        clearTimeout(timer)
        timer = setTimeout(async () => {
          manifest = await buildMedia()
          server.ws.send({ type: 'full-reload' })
        }, 300)
      }
      server.watcher.on('add', rebuild).on('change', rebuild).on('unlink', rebuild)
    },
    transformIndexHtml(html) {
      const tags = []
      // Manifest paths are root-relative ("/media/…"); prefix the deploy base (e.g. "/skanda-events/").
      const withBase = (p) => base + p.replace(/^\//, '')
      const srcSet = (s) => s.replace(/(^|, )\//g, `$1${base}`)
      const abs = (p) => (siteUrl ? new URL(p.replace(/^\//, ''), siteUrl).href : withBase(p))
      const icons = manifest?.icons
      if (icons) {
        tags.push(
          { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: withBase(icons.favicon32) } },
          { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '192x192', href: withBase(icons.favicon192) } },
          { tag: 'link', attrs: { rel: 'apple-touch-icon', href: withBase(icons.apple) } },
          { tag: 'meta', attrs: { property: 'og:image', content: abs(icons.og) } },
          { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
          { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
          { tag: 'meta', attrs: { name: 'twitter:image', content: abs(icons.og) } },
        )
      } else {
        tags.push({ tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: withBase('/favicon.svg') } })
      }
      if (manifest?.logo) {
        tags.push({
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'image',
            href: withBase(manifest.logo.src),
            ...(manifest.logo.webpSrcSet
              ? { imagesrcset: srcSet(manifest.logo.webpSrcSet), imagesizes: '(max-width: 640px) 70vw, 420px', type: 'image/webp' }
              : {}),
          },
        })
      }
      if (siteUrl) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: siteUrl } },
          { tag: 'meta', attrs: { property: 'og:url', content: siteUrl } },
        )
      }
      return {
        html: html.replaceAll('__WHATSAPP_NUMBER__', BUSINESS.whatsapp.number),
        tags: tags.map((t) => ({ ...t, injectTo: 'head' })),
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  const siteUrl = env.SITE_URL ? env.SITE_URL.replace(/\/?$/, '/') : ''
  // BASE_PATH: sub-folder the site is served from, e.g. "/skanda-events/" on GitHub Pages. Defaults to "/".
  const base = env.BASE_PATH ? `/${env.BASE_PATH.replace(/^\/|\/$/g, '')}/`.replace('//', '/') : '/'
  return {
    base,
    plugins: [react(), skandaMedia(siteUrl)],
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 700,
    },
  }
})
