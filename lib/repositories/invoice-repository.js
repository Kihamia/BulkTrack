import 'server-only'
import { getStore, nextId } from '@/lib/db/memory-store'
import { deriveStatus, normalizeInvoiceNumber, roundQty } from '@/lib/delivery'

// Data-access layer. Every function is async and returns plain objects so it
// can be re-implemented with PostgreSQL queries (see db/schema.sql) without
// touching API routes or UI components.

export class CollectionError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
  }
}

function collectedByItem(store) {
  const totals = new Map()
  for (const row of store.collection_items) {
    totals.set(row.invoice_item_id, roundQty((totals.get(row.invoice_item_id) ?? 0) + row.quantity))
  }
  return totals
}

function buildItems(store, invoiceId, totals) {
  return store.invoice_items
    .filter((item) => item.invoice_id === invoiceId)
    .map((item) => {
      const collected = totals.get(item.id) ?? 0
      return {
        id: item.id,
        sku: item.sku,
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        collected,
        outstanding: roundQty(Math.max(0, item.quantity - collected)),
      }
    })
}

function summarize(store, invoice, totals) {
  const items = buildItems(store, invoice.id, totals)
  const collections = store.collections.filter((c) => c.invoice_id === invoice.id)
  const lastCollectedAt = collections.map((c) => c.collected_at).sort().pop() ?? null
  const invoiced = items.reduce((sum, i) => sum + i.quantity, 0)
  const collected = items.reduce((sum, i) => sum + i.collected, 0)
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoice_number,
    customerName: invoice.customer_name,
    invoiceDate: invoice.invoice_date,
    status: deriveStatus(items),
    itemCount: items.length,
    collectionCount: collections.length,
    progress: invoiced > 0 ? Math.round((collected / invoiced) * 100) : 0,
    lastCollectedAt,
    items,
  }
}

function hydrateCollection(store, collection) {
  const staff = store.staff.find((s) => s.id === collection.staff_id)
  const invoice = store.invoices.find((inv) => inv.id === collection.invoice_id)
  const lines = store.collection_items
    .filter((line) => line.collection_id === collection.id)
    .map((line) => {
      const item = store.invoice_items.find((i) => i.id === line.invoice_item_id)
      return {
        invoiceItemId: line.invoice_item_id,
        sku: item?.sku,
        description: item?.description,
        unit: item?.unit,
        quantity: line.quantity,
      }
    })
  return {
    id: collection.id,
    type: collection.type,
    notes: collection.notes,
    collectedAt: collection.collected_at,
    invoiceNumber: invoice?.invoice_number,
    customerName: invoice?.customer_name,
    staff: staff ? { id: staff.id, name: staff.name, employeeCode: staff.employee_code } : null,
    lines,
  }
}

export async function listInvoices() {
  const store = getStore()
  const totals = collectedByItem(store)
  return store.invoices
    .map((invoice) => {
      const { items, ...summary } = summarize(store, invoice, totals)
      return summary
    })
    .sort((a, b) => b.invoiceDate.localeCompare(a.invoiceDate) || b.invoiceNumber.localeCompare(a.invoiceNumber))
}

export async function getInvoiceByNumber(invoiceNumber) {
  const store = getStore()
  const invoice = store.invoices.find((inv) => inv.invoice_number === normalizeInvoiceNumber(invoiceNumber))
  if (!invoice) return null
  const summary = summarize(store, invoice, collectedByItem(store))
  const history = store.collections
    .filter((c) => c.invoice_id === invoice.id)
    .sort((a, b) => b.collected_at.localeCompare(a.collected_at))
    .map((c) => hydrateCollection(store, c))
  return { ...summary, history }
}

export async function listRecentCollections(limit = 50) {
  const store = getStore()
  return [...store.collections]
    .sort((a, b) => b.collected_at.localeCompare(a.collected_at))
    .slice(0, limit)
    .map((c) => hydrateCollection(store, c))
}

export async function listStaff() {
  return getStore()
    .staff.filter((s) => s.active)
    .map((s) => ({ id: s.id, name: s.name, employeeCode: s.employee_code, role: s.role }))
}

/**
 * Records a collection as a new transaction.
 * type 'partial': `lines` = [{ invoiceItemId, quantity }]
 * type 'full':    collects every outstanding quantity; `lines` is ignored.
 * In PostgreSQL, wrap this in a transaction with SELECT ... FOR UPDATE on the
 * invoice row so concurrent collections cannot over-collect.
 */
export async function recordCollection({ invoiceNumber, staffId, type, lines = [], notes }) {
  const store = getStore()
  const invoice = store.invoices.find((inv) => inv.invoice_number === normalizeInvoiceNumber(invoiceNumber))
  if (!invoice) throw new CollectionError('Invoice not found.', 404)

  const staff = store.staff.find((s) => s.id === Number(staffId) && s.active)
  if (!staff) throw new CollectionError('Select a valid staff member.')

  if (type !== 'partial' && type !== 'full') throw new CollectionError('Invalid collection type.')

  const items = buildItems(store, invoice.id, collectedByItem(store))
  if (items.every((item) => item.outstanding <= 0)) {
    throw new CollectionError('This invoice is already fully delivered.', 409)
  }

  let toCollect
  if (type === 'full') {
    toCollect = items
      .filter((item) => item.outstanding > 0)
      .map((item) => ({ invoiceItemId: item.id, quantity: item.outstanding }))
  } else {
    if (!Array.isArray(lines)) throw new CollectionError('Invalid collection lines.')
    const seen = new Set()
    toCollect = []
    for (const line of lines) {
      const item = items.find((i) => i.id === Number(line?.invoiceItemId))
      if (!item) throw new CollectionError('A product does not belong to this invoice.')
      if (seen.has(item.id)) throw new CollectionError(`Duplicate entry for ${item.description}.`)
      seen.add(item.id)

      const quantity = roundQty(line.quantity)
      if (!Number.isFinite(quantity) || quantity < 0) {
        throw new CollectionError(`Enter a valid quantity for ${item.description}.`)
      }
      if (quantity === 0) continue
      if (quantity > item.outstanding) {
        throw new CollectionError(
          `${item.description}: only ${item.outstanding} ${item.unit} outstanding.`,
          409,
        )
      }
      toCollect.push({ invoiceItemId: item.id, quantity })
    }
    if (toCollect.length === 0) throw new CollectionError('Enter a quantity for at least one product.')
  }

  const collection = {
    id: nextId('collections'),
    invoice_id: invoice.id,
    staff_id: staff.id,
    type,
    notes: typeof notes === 'string' && notes.trim() ? notes.trim().slice(0, 500) : null,
    collected_at: new Date().toISOString(),
  }
  store.collections.push(collection)
  for (const line of toCollect) {
    store.collection_items.push({
      id: nextId('collection_items'),
      collection_id: collection.id,
      invoice_item_id: line.invoiceItemId,
      quantity: line.quantity,
    })
  }

  return getInvoiceByNumber(invoice.invoice_number)
}
