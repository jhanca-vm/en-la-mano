import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { db, eq, Image } from 'astro:db'

export default defineAction({
  input: z.string(),
  async handler(input) {
    try {
      await db.delete(Image).where(eq(Image.name, input))
    } catch {}
  }
})
