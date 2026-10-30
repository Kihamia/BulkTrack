import { CollectionError, recordCollection } from '@/lib/repositories/invoice-repository'

export async function POST(request, { params }) {
  const { invoiceNumber } = await params

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  try {
    const invoice = await recordCollection({
      invoiceNumber: decodeURIComponent(invoiceNumber),
      staffId: body?.staffId,
      type: body?.type,
      lines: body?.lines,
      notes: body?.notes,
    })
    return Response.json(invoice, { status: 201 })
  } catch (error) {
    if (error instanceof CollectionError) {
      return Response.json({ error: error.message }, { status: error.status })
    }
    console.error('[v0] Failed to record collection:', error)
    return Response.json({ error: 'Could not record collection.' }, { status: 500 })
  }
}
