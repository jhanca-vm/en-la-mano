import { defineAction } from 'astro:actions'
import { db, eq, Page } from 'astro:db'

export default defineAction({
  async handler(input) {
    // await db.insert(Page).values(input)
    await db.update(Page).set(input).where(eq(Page.pattern, input.pattern))
  }
})
