import { randomUUID } from 'node:crypto'
import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import paseto from 'paseto'
import { privateKey } from '@/lib/keys'
import getParams from '@/lib/getParams'
import prisma from '@/lib/prisma'

const { CRM_URL, REALM } = import.meta.env

export default defineAction({
  input: z.object({ script: z.number(), data: z.record(z.any()) }),
  async handler({ script, data }) {
    let { id, docNumber, ...rest } = data

    const params = getParams(script)

    const response = await fetch(`${CRM_URL}?script=${script}&deploy=1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `OAuth realm="${REALM}",${params
          .map((param) => `${param.join('="')}"`)
          .join()}`
      },
      body: JSON.stringify(data)
    })

    const { success, result } = await response.json()

    let token

    if (id) {
      const [response] = await Promise.allSettled([
        paseto.V4.sign(success ? { docNumber } : { result }, privateKey, {
          expiresIn: '1 m'
        }),
        prisma.user.update({ where: { id }, data: { result, ...rest } })
      ])

      if (response.status === 'fulfilled') token = response.value
    } else {
      id = randomUUID()

      const [response] = await Promise.allSettled([
        paseto.V4.sign(success ? { id, docNumber } : { result }, privateKey, {
          expiresIn: '1 m'
        }),
        prisma.user.create({ data: { id, docNumber, result, ...rest } })
      ])

      if (response.status === 'fulfilled') token = response.value
    }

    if (script === 36) return `/${success ? 'form' : 'result'}?token=${token}`

    return `/result?token=${token}`
  }
})
