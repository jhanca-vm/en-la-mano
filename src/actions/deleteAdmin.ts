import { defineAction } from 'astro:actions'
import prisma from '@/lib/prisma'

export default defineAction({
  handler: (username) => prisma.admin.delete({ where: { username } })
})
