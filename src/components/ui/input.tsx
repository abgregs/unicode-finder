import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'ring-foreground/80 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground ring-offset-background flex h-9 w-full min-w-0 rounded-md border-none bg-transparent px-3 py-1 text-base ring-2 ring-offset-2 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:bg-transparent file:text-sm file:font-medium file:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:ring-ring/80',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  )
}

export { Input }
