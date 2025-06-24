import { defineMiddleware } from 'astro:middleware'
import paseto from 'paseto'
import { publicKey } from './lib/keys'

export const onRequest = defineMiddleware(
  async ({ url: { pathname }, cookies, locals, redirect }, next) => {
    if (pathname.startsWith('/admin')) {
      const token = cookies.get('token')

      try {
        const { username } = await paseto.V4.verify(
          token?.value || '',
          publicKey
        )

        locals.username = username as string
      } catch {
        return redirect('/login')
      }
    }

    return next()
  }
)
