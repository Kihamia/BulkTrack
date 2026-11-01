# BulkTrack

**Track Every Delivery. Control Every Movement.**

A new Next.js + JavaScript warehouse delivery tracking starter with a responsive operations interface, demo role workspaces, invoice registration, manual invoice lookup, browser QR scanning, partial-delivery recording, CSV export and a PostgreSQL-ready Prisma schema.

## Run in VS Code

1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open http://localhost:3000

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin / CEO | admin@bulktrack.co.tz | 123@ |
| Branch Manager | manager@bulktrack.co.tz | 123@ |
| Storekeeper | storekeeper@bulktrack.co.tz | 123@ |

The manager and storekeeper demo accounts are assigned to Arusha Main. Use the Admin account to view all sample warehouses.

## What works in this demo

- Role-specific navigation and warehouse-scoped invoice lists.
- Search and filter invoices by status, warehouse, invoice number and customer.
- Register sample invoices and products.
- Record partial quantities per product; delivered and outstanding quantities recalculate and invoice status changes automatically.
- QR scanning through the browser camera using `html5-qrcode`. In demo mode, any QR payload opens a registered invoice or creates a local sample invoice for delivery testing. Manual invoice search remains available.
- Delivery performance dashboard with calendar-based start/end date filtering by invoice date, plus apply and reset controls.
- Activity log and CSV operational export.
- Local browser persistence using localStorage.

## Important production work still required

This is a functional front-end prototype, not a production-secure warehouse system. Demo passwords and sample records are client-side; do not deploy it with real company or customer data. Before production:

1. Implement server-side authentication (e.g. Auth.js) with hashed passwords, secure sessions, MFA policy and account lifecycle management.
2. Connect PostgreSQL using the Prisma schema in `prisma/schema.prisma`; run migrations and seed real reference data.
3. Move invoice/delivery operations into authenticated server actions or API routes. Enforce role and warehouse authorization on every server request, not only in the UI.
4. Record every delivery as an immutable transaction and calculate delivered totals from delivery lines inside a database transaction; reject quantities above outstanding amounts.
5. Add server-side invoice QR signature/lookup validation. Never trust a QR payload as proof of invoice authenticity by itself.
6. Add scheduled overdue/threshold notifications and notification delivery channels.
7. Configure Power BI embedding with Entra ID/service principal and row-level security. Storekeepers must have no report entitlement; branch managers must only receive their warehouse filter; CEO access must be authorized server-side.
8. Build SAP adapters after confirming the company's SAP version, available APIs, authentication, invoice/delivery document flow and source-of-truth rules. Keep SAP credentials on the server.
9. Add automated tests, backups, audit retention, monitoring, HTTPS and deployment secrets.

## Planned integration boundaries

- `Invoice source adapter`: SAP or approved upstream source imports invoice header and item data.
- `Delivery service`: validates role, warehouse assignment and outstanding quantity; writes transaction and audit event atomically.
- `Reporting adapter`: exposes authorized aggregates for Power BI.
- `Notification worker`: checks overdue invoices and configurable pending thresholds.

The Prisma schema includes users, warehouses, invoices, invoice items, delivery transactions, delivery lines, audit logs and notifications as a starting point.


## Storekeeper QR delivery demo

The Storekeeper scanner accepts any QR payload in demo mode. If the QR payload does not match an existing invoice, BulkTrack creates a local demo invoice with sample products. The Storekeeper can select Full Delivery or Partial Delivery. Changes are saved in browser local storage for the demo.
