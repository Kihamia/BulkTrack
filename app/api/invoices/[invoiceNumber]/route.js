import { getInvoiceByNumber } from '@/lib/repositories/invoice-repository'

export async function GET(_request, { params }) {
  const { invoiceNumber } = await params
  const invoice = await getInvoiceByNumber(decodeURIComponent(invoiceNumber))
  if (!invoice) return Response.json({ error: 'Invoice not found.' }, { status: 404 })
  return Response.json(invoice)
}
