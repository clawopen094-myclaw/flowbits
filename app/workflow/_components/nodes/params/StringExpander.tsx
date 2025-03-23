import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ScanText } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

function StringExpander({ 
    name, 
    value, 
    disabled,
    className, 
    mode,
    setValue, 
    updateNodeValue 
}: { 
    name: string;
    value: string; 
    disabled: boolean | undefined; 
    className: string;
    mode: string;
    setValue?: (value: string) => void;  // Optional now
    updateNodeValue?: (value: string) => void;  // Optional now
}) {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          const length = textarea.value.length;
          textarea.focus();
          textarea.setSelectionRange(length, length); // Move cursor to end
        }
      }, 0); // Ensures focus happens after render
    }
  }, [isOpen]);

  return (
    <Dialog onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn("bg-inherit",className)}
          variant="icon"
          size="xs"
          disabled={disabled}
        >
          <ScanText className="w-4 h-4 cursor-pointer stroke-secondary-foreground/50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[calc(100vw-20vw)]">
        <div className="p-0">
          <p className="text-sm font-semibold">
            {mode} {name}
          </p>
        </div>
        <div>
          <Textarea
            ref={textareaRef}
            className="resize-none min-h-[calc(100vh-30vh)]"
            onChange={(e) => setValue?.(e.target.value)}  
            value={value}
            onBlur={(e) => updateNodeValue?.(e.target.value)}
          />
          <div
            className="inset-y-0 right-0 w-12 pointer-events-none"
            style={{
              background: "linear-gradient(to right, transparent, var(--background) 80%)",
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StringExpander