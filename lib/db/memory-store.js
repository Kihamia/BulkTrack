import 'server-only'
import {
  seedCollectionItems,
  seedCollections,
  seedInvoiceItems,
  seedInvoices,
  seedStaff,
} from '@/lib/data/seed'

// Temporary in-memory tables mirroring db/schema.sql. Stored on globalThis so
// data survives hot reloads in development. Replace with a PostgreSQL client
// (e.g. @neondatabase/serverless or pg) when connecting a real database.
function createStore() {
  const clone = (rows) => rows.map((row) => ({ ...row }))
  const store = {
    staff: clone(seedStaff),
    invoices: clone(seedInvoices),
    invoice_items: clone(seedInvoiceItems),
    collections: clone(seedCollections),
    collection_items: clone(seedCollectionItems),
  }
  store.sequences = Object.fromEntries(
    Object.entries(store).map(([table, rows]) => [table, Math.max(0, ...rows.map((r) => r.id))]),
  )
  return store
}

export function getStore() {
  if (!globalThis.__warehouseStore) {
    globalThis.__warehouseStore = createStore()
  }
  return globalThis.__warehouseStore
}

export function nextId(table) {
  const store = getStore()
  store.sequences[table] += 1
  return store.sequences[table]
}
