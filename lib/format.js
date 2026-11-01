// A fixed time zone keeps server- and client-rendered timestamps identical
// and gives every collection record a consistent audit time.
export const WAREHOUSE_TIME_ZONE = process.env.NEXT_PUBLIC_WAREHOUSE_TIME_ZONE || 'UTC'

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: WAREHOUSE_TIME_ZONE,
  timeZoneName: 'short',
})

export function formatDate(isoDate) {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`))
}

export function formatDateTime(isoDateTime) {
  return dateTimeFormatter.format(new Date(isoDateTime))
}
