import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// Apple requires the (extensionless) AASA file to be served as JSON; sirv
// derives Content-Type from the extension, so it needs an explicit override.
const AASA_PATH = '/.well-known/apple-app-site-association'

// Universal-link fallback pages for people WITHOUT the app: dynamic paths the
// app claims (see the AASA/assetlinks files) are rewritten to static pages so
// they don't hit the SPA fallback (homepage). The browser URL keeps the
// original path — the pages read the code/id from location.pathname.
const LINK_REWRITES = [
  [/^\/join\/[A-Za-z0-9]+\/?$/, '/join/index.html'],
  [/^\/(book|user)\/[^/]+\/?$/, '/link/index.html'],
  [/^\/@[^/]+(\/p\/[^/]+)?\/?$/, '/link/index.html'],
]

const deepLinkMiddleware = (server) => {
  server.middlewares.use((req, res, next) => {
    const path = req.url?.split('?')[0] ?? ''
    if (path === AASA_PATH) {
      res.setHeader('Content-Type', 'application/json')
    }
    for (const [pattern, target] of LINK_REWRITES) {
      if (pattern.test(path)) {
        req.url = target
        break
      }
    }
    next()
  })
}
const deepLinkRoutes = {
  name: 'deep-link-routes',
  configureServer: deepLinkMiddleware,
  configurePreviewServer: deepLinkMiddleware,
}

export default defineConfig({
  plugins: [deepLinkRoutes],
  preview: {
    // The production deploy serves via `vite preview` behind the irlq.app
    // domain; a leading dot allows the apex and all subdomains (www, …).
    allowedHosts: ['.irlq.app'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        impressum: resolve(import.meta.dirname, 'impressum.html'),
        datenschutz: resolve(import.meta.dirname, 'datenschutz.html'),
        nutzungsbedingungen: resolve(import.meta.dirname, 'nutzungsbedingungen.html'),
        claim: resolve(import.meta.dirname, 'claim/index.html'),
        join: resolve(import.meta.dirname, 'join/index.html'),
        link: resolve(import.meta.dirname, 'link/index.html'),
      },
    },
  },
})
