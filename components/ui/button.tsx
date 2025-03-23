import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary rounded-md text-primary-foreground hover:bg-primary/90",
        avatar: "rounded-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        destructive:
          "bg-destructive rounded-md text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border rounded-md border-input bg-background hover:bg-accent hover:text-accent-foreground",
        theme:
          "border rounded-tr-md rounded-br-md border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary rounded-md text-secondary-foreground hover:bg-secondary/80",
        danger:
          "bg-secondary rounded-md text-white bg-red-600 dark:bg-red-600/80",
        ghost: "hover:bg-accent rounded-md hover:text-accent-foreground",
        link: "text-primary rounded-md underline-offset-4 hover:underline",
        sidebarIcon: "gap-2 rounded-md !justify-start hover:bg-accent hover:bg-primary/80 hover:text-primary-foreground border shadow",
        sidebarActiveIcon: "gap-2 rounded-md !justify-start bg-primary text-primary-foreground hover:bg-primary/90",
        icon: "!p-0.7 !w-4 !h-6 !rounded-full hover:bg-accent"
      },
      size: {
        default: "h-10 px-4 py-2",
        avatar: "h-10 w-10",
        sm: "h-9 rounded-md px-3",
        xs: "h-7 rounded-md px-3",
        theme: "h-7 rounded-tr-md rounded-br-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        iconSm: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
