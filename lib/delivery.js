export const STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  DELIVERED: 'delivered',
}

export const STATUS_LABELS = {
  pending: 'Pending',
  partial: 'Partially Delivered',
  delivered: 'Fully Delivered',
}

// Quantities are NUMERIC(12,3) in PostgreSQL; round to 3 decimals to avoid float drift.
export function roundQty(value) {
  return Math.round(Number(value) * 1000) / 1000
}

export function formatQty(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(value)
}

export function deriveStatus(items) {
  const collected = items.reduce((sum, item) => sum + item.collected, 0)
  if (collected <= 0) return STATUS.PENDING
  if (items.every((item) => item.outstanding <= 0)) return STATUS.DELIVERED
  return STATUS.PARTIAL
}

export function normalizeInvoiceNumber(value) {
  return String(value ?? '').trim().toUpperCase()
}

// QR codes may encode a bare invoice number or a URL such as
// https://example.com/invoices/INV-2026-1001 or ?invoice=INV-2026-1001.
export function parseScannedCode(raw) {
  const text = String(raw ?? '').trim()
  try {
    const url = new URL(text)
    const fromQuery = url.searchParams.get('invoice') ?? url.searchParams.get('inv')
    if (fromQuery) return normalizeInvoiceNumber(fromQuery)
    const lastSegment = url.pathname.split('/').filter(Boolean).pop()
    return normalizeInvoiceNumber(decodeURIComponent(lastSegment ?? ''))
  } catch {
    return normalizeInvoiceNumber(text)
  }
}
