import { defineAction } from 'astro:actions'
import prisma from '@/lib/prisma'

export default defineAction({
  async handler(username) {
    await prisma.admin.update({ where: { username }, data: { secret: null } })
  }
})
