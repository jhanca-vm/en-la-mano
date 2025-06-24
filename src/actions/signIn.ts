import { ActionError, defineAction } from 'astro:actions'
import argon2 from 'argon2'
import qrcode from 'qrcode'
import prisma from '@/lib/prisma'
import { authenticator } from 'otplib'

export default defineAction({
  accept: 'form',
  async handler(formData, context) {
    const { username, password } = Object.fromEntries<any>(formData)
    const admin = await prisma.admin.findUnique({ where: { username } })

    if (admin && (await argon2.verify(admin.hash, password))) {
      if (admin.secret) return { secret: admin.secret }

      const secret = authenticator.generateSecret()
      const keyuri = authenticator.keyuri(username, 'En La Mano', secret)
      const qr = await qrcode.toDataURL(keyuri)

      return { secret, qr }
    }

    throw new ActionError({
      code: 'UNAUTHORIZED',
      message: 'Usuario o contraseña incorrectos.'
    })
  }
})
