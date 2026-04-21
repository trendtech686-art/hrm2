import * as React from 'react'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      richColors
      closeButton
      position="top-right"
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
