'use client'

import { QRCodeSVG } from 'qrcode.react'

export function InvoiceQr({ invoiceNumber }) {
  return (
    <section aria-labelledby="qr-heading" className="flex items-center gap-4 rounded-lg border bg-card p-4">
      <div className="rounded-md border bg-white p-2">
        <QRCodeSVG value={invoiceNumber} size={88} title={`QR code for ${invoiceNumber}`} />
      </div>
      <div className="flex flex-col gap-1">
        <h2 id="qr-heading" className="text-sm font-semibold">
          Invoice QR code
        </h2>
        <p className="text-xs text-muted-foreground text-pretty">
          Matches the code printed on the invoice. Scan it from another device to open this record.
        </p>
      </div>
    </section>
  )
}
