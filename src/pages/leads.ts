import type { APIRoute } from 'astro'
import { Parser } from '@json2csv/plainjs'
import paseto from 'paseto'
import prisma from '@/lib/prisma'
import { publicKey } from '@/lib/keys'

export const GET: APIRoute = async ({ url }) => {
  const data = await prisma.user.findMany()
  const parser = new Parser()
  const token = url.searchParams.get('token')
  const year = url.searchParams.get('year')
  const month = url.searchParams.get('month')

  try {
    await paseto.V4.verify(token || '', publicKey)

    let csv

    if (year && month) {
      csv = parser.parse(
        data.filter(
          (user) =>
            user.updatedAt.getFullYear() === Number(year) &&
            user.updatedAt.getMonth() + 1 === Number(month)
        )
      )
    } else if (year) {
      csv = parser.parse(
        data.filter((user) => user.updatedAt.getFullYear() === Number(year))
      )
    } else {
      csv = parser.parse(data)
    }

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition':
          'attachment; filename=leads' +
          (month ? `-${month}` : '') +
          (year ? `-${year}` : '') +
          '.csv'
      }
    })
  } catch {
    return new Response(null, { status: 401, statusText: 'Unauthorized' })
  }
}
