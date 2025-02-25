import { defineMiddleware } from 'astro:middleware'
import paseto from 'paseto'
import { publicKey } from './lib/keys'

const protectedRoutes = [
  '/admin',
  '/admin/leads',
  '/admin/landings',
  '/admin/quienes-somos',
  '/admin/preguntas-frecuentes',
  '/admin/terminos-y-condiciones',
  '/admin/politicas-de-privacidad',
  '/admin/politicas-de-seguridad',
  '/leads.csv'
]

export const onRequest = defineMiddleware(
  async ({ url, cookies, redirect }, next) => {
    if (protectedRoutes.includes(url.pathname)) {
      const token = cookies.get('token')

      try {
        await paseto.V4.verify(token?.value || '', publicKey)
      } catch {
        return redirect('/admin/login')
      }
    }

    return next()
  }
)
