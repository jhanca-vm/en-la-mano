import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { db, eq, Image } from 'astro:db'

export default defineAction({
  input: z.object({ name: z.string(), data: z.string() }),
  async handler(input) {
    try {
      await db.insert(Image).values(input)
    } catch {
      await db.update(Image).set(input).where(eq(Image.name, input.name))
    }
  }
})
