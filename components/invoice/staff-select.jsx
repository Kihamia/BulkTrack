'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function StaffSelect({ staff, value, onChange, invalid }) {
  const items = staff.map((s) => ({ value: String(s.id), label: `${s.name} (${s.employeeCode})` }))

  return (
    <div className="flex flex-col gap-2">
      <Label id="staff-label">Collected by (staff member)</Label>
      <Select items={items} value={value} onValueChange={onChange}>
        <SelectTrigger aria-labelledby="staff-label" aria-invalid={invalid || undefined} className="h-11 w-full">
          <SelectValue placeholder="Select staff member" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
