import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
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
      },
    },
  },
})
