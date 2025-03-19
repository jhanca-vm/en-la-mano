import type { User } from '@prisma/client'
import { format, parse } from '@formkit/tempo'
import type { APIRoute } from 'astro'
import { Parser } from '@json2csv/plainjs'
import paseto from 'paseto'
import prisma from '@/lib/prisma'
import { publicKey } from '@/lib/keys'

function formatDates(user: User) {
  const formatDate = (date: Date | string) => format(date, 'YYYY-MM-DD')

  user.createdAt = formatDate(user.createdAt) as any

  if (user.dateOfBirth) {
    user.dateOfBirth = formatDate(parse(user.dateOfBirth, 'DD/MM/YYYY'))
  }

  if (user.workStartDate) {
    user.workStartDate = formatDate(parse(user.workStartDate, 'DD/MM/YYYY'))
  }

  return user
}

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
        data
          .filter(
            (user) =>
              user.createdAt.getFullYear() === Number(year) &&
              user.createdAt.getMonth() + 1 === Number(month)
          )
          .map(formatDates)
      )
    } else if (year) {
      csv = parser.parse(
        data
          .filter((user) => user.createdAt.getFullYear() === Number(year))
          .map(formatDates)
      )
    } else {
      csv = parser.parse(data.map(formatDates))
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
