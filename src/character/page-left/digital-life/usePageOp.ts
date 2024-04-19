import { useState } from 'react'

export function usePageOp(pageMinified: boolean) {
  const [open, setOpen] = useState(false)

  return { open: open && !pageMinified, setOpen }
}
