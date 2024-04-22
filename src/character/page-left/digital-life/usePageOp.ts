import { useState } from 'react'

export function usePageOp() {
  const [open, setOpen] = useState(false)

  return { open: open, setOpen }
}
