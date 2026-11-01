import { listInvoices } from '@/lib/repositories/invoice-repository'

export async function GET(request) {
  const status = request.nextUrl.searchParams.get('status')
  const invoices = await listInvoices()
  return Response.json(status ? invoices.filter((inv) => inv.status === status) : invoices)
}
