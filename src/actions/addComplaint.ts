import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import filter from 'just-filter-object'
import paseto from 'paseto'
import prisma from '@/lib/prisma'
import { privateKey } from '@/lib/keys'

export default defineAction({
  input: z.record(z.string()),
  async handler(input) {
    const data = filter(input, (_, value) => value) as any
    const { id } = await prisma.complaint.create({ data })
    const token = await paseto.V4.sign({ id }, privateKey, { expiresIn: '1 m' })

    return token
  }
})
