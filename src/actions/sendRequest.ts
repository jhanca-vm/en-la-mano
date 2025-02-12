import { createHmac, createSecretKey, randomBytes } from 'node:crypto'
import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import paseto from 'paseto'
import { privateKey } from '@/keys'

interface Data {
  docNumber: string
  success: boolean
  result: string | null
}

const env = import.meta.env

export default defineAction({
  input: z.object({ script: z.number(), data: z.record(z.any()) }),
  async handler({ script, data }) {
    const params: [string, string | number][] = [
      ['oauth_consumer_key', env.CONSUMER_KEY],
      ['oauth_token', env.TOKEN],
      ['oauth_signature_method', 'HMAC-SHA256'],
      ['oauth_timestamp', Math.round(Date.now() / 1000)],
      ['oauth_nonce', randomBytes(10).toString('hex')]
    ]

    params.push([
      'oauth_signature',
      encodeURIComponent(
        createHmac(
          'sha256',
          createSecretKey(`${env.CONSUMER_SECRET}&${env.TOKEN_SECRET}`, 'utf-8')
        )
          .update(
            `POST&${encodeURIComponent(env.CRM_URL)}` +
              `&${encodeURIComponent(
                `deploy=1&${params
                  .map((param) => param.join('='))
                  .sort()
                  .join('&')}&script=${script}`
              )}`
          )
          .digest('base64')
      )
    ])

    const response = await fetch(`${env.CRM_URL}?script=${script}&deploy=1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `OAuth realm="7564430",${params
          .map((param) => `${param.join('="')}"`)
          .join()}`
      },
      body: JSON.stringify(data)
    })

    const { success, docNumber, result } = await response.json()

    const token = await paseto.V4.sign(
      success ? { sub: docNumber } : { result },
      privateKey,
      { expiresIn: '1 m' }
    )

    if (script === 36) return `/${success ? 'form' : 'result'}?token=${token}`

    return `/result?token=${token}`
  }
})
