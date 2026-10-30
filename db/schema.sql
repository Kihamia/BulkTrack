-- PostgreSQL schema for the Warehouse Delivery Tracker.
-- The in-memory store in lib/db/memory-store.js mirrors these tables 1:1,
-- so the repository layer (lib/repositories) can be swapped to SQL queries
-- without changing API routes or UI components.

CREATE TABLE IF NOT EXISTS staff (
  id            SERIAL PRIMARY KEY,
  employee_code TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'Warehouse Staff',
  active        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS invoices (
  id             SERIAL PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_name  TEXT NOT NULL,
  invoice_date   DATE NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id          SERIAL PRIMARY KEY,
  invoice_id  INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  sku         TEXT NOT NULL,
  description TEXT NOT NULL,
  unit        TEXT NOT NULL,
  quantity    NUMERIC(12, 3) NOT NULL CHECK (quantity > 0)
);

-- Every collection (partial or full) is stored as its own transaction.
CREATE TABLE IF NOT EXISTS collections (
  id           SERIAL PRIMARY KEY,
  invoice_id   INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  staff_id     INTEGER NOT NULL REFERENCES staff(id),
  type         TEXT NOT NULL CHECK (type IN ('partial', 'full')),
  notes        TEXT,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collection_items (
  id              SERIAL PRIMARY KEY,
  collection_id   INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  invoice_item_id INTEGER NOT NULL REFERENCES invoice_items(id),
  quantity        NUMERIC(12, 3) NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_collections_invoice ON collections(invoice_id);
CREATE INDEX IF NOT EXISTS idx_collections_collected_at ON collections(collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items(collection_id);

-- Delivery status is derived, never stored, so it can't drift from the transactions:
--   pending   = no quantity collected
--   partial   = some, but not all, quantity collected
--   delivered = every invoice item fully collected
CREATE OR REPLACE VIEW invoice_item_progress AS
SELECT
  ii.id AS invoice_item_id,
  ii.invoice_id,
  ii.quantity AS invoiced_quantity,
  COALESCE(SUM(ci.quantity), 0) AS collected_quantity,
  ii.quantity - COALESCE(SUM(ci.quantity), 0) AS outstanding_quantity
FROM invoice_items ii
LEFT JOIN collection_items ci ON ci.invoice_item_id = ii.id
GROUP BY ii.id;
