import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { db, eq, Page } from 'astro:db'

export default defineAction({
  input: z.record(z.any()),
  async handler(input) {
    const { pattern, ...data } = input

    await db
      .update(Page)
      .set({ data })
      .where(eq(Page.pattern, pattern as string))
  }
})
