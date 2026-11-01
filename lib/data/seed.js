// Sample data shaped exactly like the rows in db/schema.sql.

export const seedStaff = [
  { id: 1, employee_code: 'WH-014', name: 'Amina Hassan', role: 'Dispatch Supervisor', active: true },
  { id: 2, employee_code: 'WH-022', name: 'David Mwangi', role: 'Warehouse Staff', active: true },
  { id: 3, employee_code: 'WH-031', name: 'Grace Otieno', role: 'Warehouse Staff', active: true },
  { id: 4, employee_code: 'WH-045', name: 'Peter Kamau', role: 'Forklift Operator', active: true },
]

export const seedInvoices = [
  { id: 1, invoice_number: 'INV-2026-1001', customer_name: 'Coastal Hardware Ltd', invoice_date: '2026-10-29' },
  { id: 2, invoice_number: 'INV-2026-1002', customer_name: 'Summit Builders Supply', invoice_date: '2026-10-28' },
  { id: 3, invoice_number: 'INV-2026-1003', customer_name: 'Greenfield Agro Traders', invoice_date: '2026-10-28' },
  { id: 4, invoice_number: 'INV-2026-1004', customer_name: 'Metro Office Solutions', invoice_date: '2026-10-27' },
  { id: 5, invoice_number: 'INV-2026-1005', customer_name: 'Lakeside Electricals', invoice_date: '2026-10-25' },
  { id: 6, invoice_number: 'INV-2026-1006', customer_name: 'Highland Paints & Coatings', invoice_date: '2026-10-24' },
  { id: 7, invoice_number: 'INV-2026-1007', customer_name: 'Prime Plumbing Distributors', invoice_date: '2026-10-22' },
  { id: 8, invoice_number: 'INV-2026-1008', customer_name: 'Unity Supermarkets', invoice_date: '2026-10-21' },
]

export const seedInvoiceItems = [
  { id: 1, invoice_id: 1, sku: 'CEM-50', description: 'Portland Cement 50kg', unit: 'bag', quantity: 120 },
  { id: 2, invoice_id: 1, sku: 'RB-12', description: 'Steel Rebar 12mm x 6m', unit: 'pcs', quantity: 200 },
  { id: 3, invoice_id: 1, sku: 'NL-75', description: 'Wire Nails 75mm', unit: 'kg', quantity: 45 },

  { id: 4, invoice_id: 2, sku: 'TL-6060', description: 'Ceramic Floor Tiles 60x60', unit: 'box', quantity: 80 },
  { id: 5, invoice_id: 2, sku: 'ADH-20', description: 'Tile Adhesive 20kg', unit: 'bag', quantity: 40 },
  { id: 6, invoice_id: 2, sku: 'GRT-5', description: 'Tile Grout 5kg', unit: 'bag', quantity: 24 },

  { id: 7, invoice_id: 3, sku: 'FRT-NPK', description: 'NPK Fertilizer 50kg', unit: 'bag', quantity: 150 },
  { id: 8, invoice_id: 3, sku: 'HSE-25', description: 'Garden Hose 25m', unit: 'roll', quantity: 30 },

  { id: 9, invoice_id: 4, sku: 'PPR-A4', description: 'A4 Copy Paper 80gsm', unit: 'carton', quantity: 60 },
  { id: 10, invoice_id: 4, sku: 'CHR-ERG', description: 'Ergonomic Office Chair', unit: 'pcs', quantity: 25 },
  { id: 11, invoice_id: 4, sku: 'TNR-85A', description: 'Laser Toner Cartridge 85A', unit: 'pcs', quantity: 40 },
  { id: 12, invoice_id: 4, sku: 'FLD-LA', description: 'Lever Arch Files', unit: 'box', quantity: 30 },

  { id: 13, invoice_id: 5, sku: 'CBL-25', description: 'Copper Cable 2.5mm', unit: 'roll', quantity: 50 },
  { id: 14, invoice_id: 5, sku: 'SWT-1G', description: 'Single Gang Switch', unit: 'box', quantity: 20 },

  { id: 15, invoice_id: 6, sku: 'PNT-EM20', description: 'Emulsion Paint White 20L', unit: 'bucket', quantity: 64 },
  { id: 16, invoice_id: 6, sku: 'PNT-GL4', description: 'Gloss Enamel 4L', unit: 'tin', quantity: 48 },
  { id: 17, invoice_id: 6, sku: 'THN-5', description: 'Paint Thinner', unit: 'L', quantity: 37.5 },

  { id: 18, invoice_id: 7, sku: 'PVC-110', description: 'PVC Pipe 110mm x 6m', unit: 'pcs', quantity: 90 },
  { id: 19, invoice_id: 7, sku: 'ELB-110', description: 'PVC Elbow 110mm', unit: 'pcs', quantity: 150 },
  { id: 20, invoice_id: 7, sku: 'TNK-1K', description: 'Water Tank 1000L', unit: 'pcs', quantity: 6 },

  { id: 21, invoice_id: 8, sku: 'RCE-25', description: 'Long Grain Rice 25kg', unit: 'bag', quantity: 100 },
  { id: 22, invoice_id: 8, sku: 'OIL-20', description: 'Vegetable Oil 20L', unit: 'jerrycan', quantity: 45 },
  { id: 23, invoice_id: 8, sku: 'SGR-50', description: 'White Sugar 50kg', unit: 'bag', quantity: 60 },
]

export const seedCollections = [
  { id: 1, invoice_id: 2, staff_id: 2, type: 'partial', notes: 'Customer truck capacity limited.', collected_at: '2026-10-29T08:42:00.000Z' },

  { id: 2, invoice_id: 4, staff_id: 3, type: 'partial', notes: null, collected_at: '2026-10-27T13:15:00.000Z' },
  { id: 3, invoice_id: 4, staff_id: 1, type: 'partial', notes: 'Chairs balance to follow.', collected_at: '2026-10-29T10:05:00.000Z' },

  { id: 4, invoice_id: 5, staff_id: 4, type: 'full', notes: null, collected_at: '2026-10-26T09:30:00.000Z' },

  { id: 5, invoice_id: 7, staff_id: 2, type: 'partial', notes: null, collected_at: '2026-10-23T11:20:00.000Z' },
  { id: 6, invoice_id: 7, staff_id: 1, type: 'full', notes: 'Balance collected with second truck.', collected_at: '2026-10-24T15:45:00.000Z' },

  { id: 7, invoice_id: 8, staff_id: 3, type: 'partial', notes: null, collected_at: '2026-10-30T07:55:00.000Z' },
]

export const seedCollectionItems = [
  { id: 1, collection_id: 1, invoice_item_id: 4, quantity: 50 },
  { id: 2, collection_id: 1, invoice_item_id: 5, quantity: 40 },

  { id: 3, collection_id: 2, invoice_item_id: 9, quantity: 30 },
  { id: 4, collection_id: 2, invoice_item_id: 11, quantity: 40 },
  { id: 5, collection_id: 3, invoice_item_id: 9, quantity: 30 },
  { id: 6, collection_id: 3, invoice_item_id: 10, quantity: 10 },
  { id: 7, collection_id: 3, invoice_item_id: 12, quantity: 30 },

  { id: 8, collection_id: 4, invoice_item_id: 13, quantity: 50 },
  { id: 9, collection_id: 4, invoice_item_id: 14, quantity: 20 },

  { id: 10, collection_id: 5, invoice_item_id: 18, quantity: 60 },
  { id: 11, collection_id: 5, invoice_item_id: 19, quantity: 150 },
  { id: 12, collection_id: 6, invoice_item_id: 18, quantity: 30 },
  { id: 13, collection_id: 6, invoice_item_id: 20, quantity: 6 },

  { id: 14, collection_id: 7, invoice_item_id: 21, quantity: 40 },
]
