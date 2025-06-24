import { ActionError, defineAction } from 'astro:actions'
import argon2 from 'argon2'
import prisma from '@/lib/prisma'

export default defineAction({
  async handler({ username, password, newPassword }) {
    const admin = await prisma.admin.findUnique({ where: { username } })
    const isValid = await argon2.verify(admin!.hash, password)

    if (!isValid) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'Contraseña incorrecta.'
      })
    }

    const hash = await argon2.hash(newPassword)

    await prisma.admin.update({ where: { username }, data: { hash } })
  }
})
