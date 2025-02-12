import { defineMiddleware } from 'astro:middleware'
import paseto from 'paseto'
import { publicKey } from './keys'

const protectedRoutes = ['/admin']

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
