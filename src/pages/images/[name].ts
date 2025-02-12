import type { APIRoute } from 'astro'
import { db, eq, Image } from 'astro:db'

export const GET: APIRoute = async ({ params }) => {
  const [image] = await db
    .select()
    .from(Image)
    .where(eq(Image.name, params.name!))

  if (image !== undefined) {
    const [type, base64] = image.data.substring(5).split(';base64,')
    const buffer = Buffer.from(base64, 'base64')

    return new Response(buffer, { headers: { 'Content-Type': type } })
  }

  return new Response(null, { status: 404, statusText: 'Not found' })
}
