import { ActionError, defineAction } from 'astro:actions'
import { authenticator } from 'otplib'
import paseto from 'paseto'
import prisma from '@/lib/prisma'
import { privateKey } from '@/lib/keys'

export default defineAction({
  async handler({ secret, code, isRegistered, username }) {
    const isValid = authenticator.check(code, secret)

    if (!isValid) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'Código inválido.'
      })
    }

    const [token] = await Promise.all([
      paseto.V4.sign({ username }, privateKey),
      !isRegistered &&
        prisma.admin.update({ where: { username }, data: { secret } })
    ])

    return token
  }
})
