import { connection } from 'next/server'
import { PageHeader } from '@/components/page-header'
import { ScanPanel } from '@/components/scan/scan-panel'
import { listInvoices } from '@/lib/repositories/invoice-repository'

export const metadata = { title: 'Scan Invoice' }

export default async function ScanPage() {
  await connection()
  const invoices = await listInvoices()

  return (
    <>
      <PageHeader
        title="Scan invoice"
        description="Scan the QR code on a company invoice or type the invoice number to record a collection."
      />
      <ScanPanel sampleNumbers={invoices.map((inv) => inv.invoiceNumber)} />
    </>
  )
}
