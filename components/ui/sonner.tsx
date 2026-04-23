"use client"

import * as React from 'react'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Mobile-first toast position: we drop toasts at the top-center on narrow
 * viewports (easier to read with one hand, avoids colliding with sticky form
 * footers) and at the top-right on desktop where they sit out of the way.
 * The media-query listener updates the position dynamically when users rotate
 * the device or resize the window.
 */
function useResponsiveToastPosition(): ToasterProps['position'] {
  const [position, setPosition] = React.useState<ToasterProps['position']>('top-right')

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setPosition(mq.matches ? 'top-center' : 'top-right')
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return position
}

const Toaster = ({ ...props }: ToasterProps) => {
  const position = useResponsiveToastPosition()
  return (
    <Sonner
      richColors
      closeButton
      position={position}
      toastOptions={{
        classNames: {
          toast:
            'group pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-border bg-background p-4 text-sm text-foreground shadow-lg',
          title: 'text-sm font-semibold text-foreground',
          description: 'text-sm text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
          closeButton: 'bg-background text-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
