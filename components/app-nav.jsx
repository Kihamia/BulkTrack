'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { History, LayoutDashboard, ScanLine, Warehouse } from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/scan', label: 'Scan Invoice', Icon: ScanLine },
  { href: '/activity', label: 'Activity', Icon: History },
]

function isActive(pathname, href) {
  if (href === '/') return pathname === '/' || pathname.startsWith('/invoices')
  return pathname.startsWith(href)
}

export function AppNav() {
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Warehouse className="size-4.5" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">DeliveryDesk</span>
              <span className="text-xs text-muted-foreground">Warehouse Collections</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ href, label, Icon }) => {
              const active = isActive(pathname, href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="grid grid-cols-3">
          {LINKS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center gap-1 py-2.5 text-xs font-medium',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
