import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import argon2 from 'argon2'
import prisma from '@/lib/prisma'

export default defineAction({
  accept: 'form',
  input: z.object({ username: z.string(), password: z.string() }),
  async handler({ username, password }) {
    const hash = await argon2.hash(password)

    await prisma.admin.create({ data: { username: username.trim(), hash } })
  }
})
