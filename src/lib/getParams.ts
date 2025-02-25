import { createHmac, createSecretKey, randomBytes } from 'node:crypto'

const env = import.meta.env

export default function getParams(script: number) {
  const params: [string, string | number][] = [
    ['oauth_consumer_key', env.CONSUMER_KEY],
    ['oauth_token', env.ACCESS_TOKEN],
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

  return params
}
