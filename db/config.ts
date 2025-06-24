import { column, defineDb, defineTable } from 'astro:db'

const Page = defineTable({
  columns: {
    pattern: column.text({ primaryKey: true }),
    data: column.json()
  }
})

const Image = defineTable({
  columns: {
    name: column.text({ primaryKey: true }),
    data: column.text()
  }
})

export default defineDb({ tables: { Page, Image } })
