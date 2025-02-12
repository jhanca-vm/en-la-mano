import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { Admin, db } from 'astro:db'
import argon2 from 'argon2'
import paseto from 'paseto'
import { privateKey } from '@/keys'

export default defineAction({
  accept: 'form',
  input: z.object({ username: z.string(), password: z.string() }),
  async handler({ username, password }, context) {
    const [admin] = await db.select().from(Admin)

    if (username === admin.username) {
      if (await argon2.verify(admin.hash, password)) {
        const token = await paseto.V4.sign({ username }, privateKey)

        context.cookies.set('token', token)
      }
    }

    throw new ActionError({
      code: 'UNAUTHORIZED',
      message: 'Usuario o contraseña incorrectos.'
    })
  }
})
