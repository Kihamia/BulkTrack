import Link from 'next/link'
import { connection } from 'next/server'
import { ScanLine } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { StatCards } from '@/components/dashboard/stat-cards'
import { InvoiceList } from '@/components/dashboard/invoice-list'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { listInvoices, listRecentCollections } from '@/lib/repositories/invoice-repository'

export default async function DashboardPage() {
  await connection()
  const [invoices, recent] = await Promise.all([listInvoices(), listRecentCollections(6)])

  return (
    <>
      <PageHeader
        title="Delivery dashboard"
        description="Track invoice collections across pending, partial, and completed deliveries."
        actions={
          <Link href="/scan" className={buttonVariants({ size: 'lg' })}>
            <ScanLine aria-hidden="true" />
            Scan invoice
          </Link>
        }
      />
      <div className="flex flex-col gap-6">
        <StatCards invoices={invoices} />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <InvoiceList invoices={invoices} />
          <RecentActivity collections={recent} />
        </div>
      </div>
    </>
  )
}
