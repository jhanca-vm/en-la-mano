import type { APIRoute } from 'astro'
import { Parser } from '@json2csv/plainjs'
import paseto from 'paseto'
import prisma from '@/lib/prisma'
import { publicKey } from '@/lib/keys'

export const GET: APIRoute = async ({ url }) => {
  const data = await prisma.complaint.findMany()
  const parser = new Parser()
  const token = url.searchParams.get('token')

  try {
    await paseto.V4.verify(token || '', publicKey)

    const csv = parser.parse(data)

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=reclamos.csv'
      }
    })
  } catch {
    return new Response(null, { status: 401, statusText: 'Unauthorized' })
  }
}
