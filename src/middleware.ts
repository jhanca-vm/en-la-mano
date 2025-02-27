import { defineMiddleware } from 'astro:middleware'
import paseto from 'paseto'
import { publicKey } from './lib/keys'

export const onRequest = defineMiddleware(
  async ({ url: { pathname }, cookies, redirect }, next) => {
    if (pathname.startsWith('/admin')) {
      const token = cookies.get('token')

      try {
        await paseto.V4.verify(token?.value || '', publicKey)
      } catch {
        return redirect('/login')
      }
    }

    return next()
  }
)
