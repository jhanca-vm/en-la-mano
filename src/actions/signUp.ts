import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { Admin, db } from 'astro:db'
import argon2 from 'argon2'
import paseto from 'paseto'
import { privateKey } from '@/lib/keys'

export default defineAction({
  accept: 'form',
  input: z.object({ username: z.string(), password: z.string() }),
  async handler({ username, password }, context) {
    const [token] = await Promise.all([
      paseto.V4.sign({ username }, privateKey),
      argon2
        .hash(password)
        .then((hash) => db.insert(Admin).values({ username, hash }))
    ])

    context.cookies.set('token', token)
  }
})
