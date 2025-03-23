"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    {/* Background gradient track that will be revealed */}
    <div className="absolute h-1.5 w-full rounded-full overflow-hidden bg-gradient-to-r from-blue-200 to-blue-600" />
    
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-transparent">
      {/* Cover that hides the gradient on the unselected portion */}
      <div className="absolute right-0 h-full bg-secondary" 
           style={{ 
             width: `${100 - (props.value ? (Array.isArray(props.value) ? props.value[0] : props.value) / (props.max || 100) * 100 : 0)}%` 
           }} />
    </SliderPrimitive.Track>
    
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-400 z-10" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }