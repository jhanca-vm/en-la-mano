import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import paseto from 'paseto'
import { privateKey } from '@/lib/keys'
import getParams from '@/lib/getParams'
import prisma from '@/lib/prisma'

const { CRM_URL, REALM } = import.meta.env

export default defineAction({
  input: z.object({ script: z.number(), data: z.record(z.string()) }),
  async handler({ script, data }) {
    const { docNumber, ...rest } = data

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

    const updateUser = () => {
      return prisma.user.update({
        where: { docNumber },
        data: { result, updatedAt: new Date(), ...rest }
      })
    }

    const [token] = await Promise.all([
      paseto.V4.sign(success ? { sub: docNumber } : { result }, privateKey, {
        expiresIn: '1 m'
      }),
      script === 36
        ? prisma.user
            .create({
              data: { docNumber, result, updatedAt: new Date(), ...rest }
            })
            .catch(updateUser)
        : updateUser()
    ])

    if (script === 36) return `/${success ? 'form' : 'result'}?token=${token}`

    return `/result?token=${token}`
  }
})
