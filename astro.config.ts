import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import db from '@astrojs/db'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [db(), react()],
  vite: { plugins: [tailwindcss()] },
  server: { host: true, port: 3000 },
  devToolbar: { enabled: false }
})
