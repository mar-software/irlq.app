import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// Apple requires the (extensionless) AASA file to be served as JSON; sirv
// derives Content-Type from the extension, so it needs an explicit override.
const AASA_PATH = '/.well-known/apple-app-site-association'
const aasaMiddleware = (server) => {
  server.middlewares.use((req, res, next) => {
    if (req.url?.split('?')[0] === AASA_PATH) {
      res.setHeader('Content-Type', 'application/json')
    }
    next()
  })
}
const aasaContentType = {
  name: 'aasa-content-type',
  configureServer: aasaMiddleware,
  configurePreviewServer: aasaMiddleware,
}

export default defineConfig({
  plugins: [aasaContentType],
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
      },
    },
  },
})
