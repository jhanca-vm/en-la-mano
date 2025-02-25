import type { APIRoute } from 'astro'
import { Parser } from '@json2csv/plainjs'
import prisma from '@/lib/prisma'

export const GET: APIRoute = async () => {
  const data = await prisma.user.findMany()
  const parser = new Parser()
  const csv = parser.parse(data)

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=leads.csv'
    }
  })
}
