import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { Resend } from 'resend'
import filter from 'just-filter-object'
import mjml from 'mjml'
import paseto from 'paseto'
import prisma from '@/lib/prisma'
import { privateKey } from '@/lib/keys'

export default defineAction({
  input: z.record(z.string()),
  async handler(input, { url }) {
    const resend = new Resend(import.meta.env.RESEND_API_KEY)
    const data = filter(input, (_, value) => value) as any
    const { id } = await prisma.complaint.create({ data })
    const { html } = mjml(`
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image
                width="100px"
                src="${url.origin}/images/logo"
              ></mj-image>
              <mj-divider border-color="#3f0b79"></mj-divider>
              <mj-text font-size="18px" line-height="1.5" color="#07024a">
                <h2 style="color:#ff7100">
                  Su número de reclamo es el: #${data.id}
                </h2>
                <p>
                  Usted recibirá una respuesta del mismo en un plazo máximo de
                  quince días corridos a partir del día de la fecha. Dicho plazo
                  podrá prorrogarse por única vez por otros quince días
                  corridos, siempre que la naturaleza del reclamo así lo
                  amerite, en cuyo caso recibirá por escrito los motivos de la
                  prórroga.
                </p>
                <p>
                  Cualquier vencimiento de plazo que ocurriera en día inhábil,
                  correrá el vencimiento para el día hábil siguiente.
                </p>
                <p>
                  La respuesta escrita no será necesaria si el reclamo es
                  resuelto a vuestro favor dentro de un plazo de 2 días hábiles
                  a partir de la fecha.
                </p>
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `)

    const [token] = await Promise.all([
      paseto.V4.sign({ id }, privateKey, { expiresIn: '1 m' }),
      resend.emails.send({
        from: 'En La Mano <reclamos@enlamano.com.uy>',
        to: [data.email],
        subject: `Su reclamo ha sido enviado correctamente`,
        html
      })
    ])

    return token
  }
})
