import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import db from '@astrojs/db'
import preact from '@astrojs/preact'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [db(), preact()],
  vite: { plugins: [tailwindcss()] },
  server: { host: true, port: 3000 },
  devToolbar: { enabled: false }
})
