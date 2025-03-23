"use client"

import * as React from "react"
import { Check, ChevronsUpDown, FlaskConical } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export function ComboboxSelector({ models, mvalue, updateNodeParamValue }: { 
  models: { value: string; label: string }[], 
  mvalue: string, 
  updateNodeParamValue: (newValue: string) => void 
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(mvalue);

  React.useEffect(() => {
    setValue(mvalue);
  }, [mvalue]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    updateNodeParamValue(newValue);
    setOpen(false);
  };

  const selectedModel = models.find((model) => String(model.value).trim() === String(value).trim());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full text-sm justify-between"
        >
          {selectedModel ? selectedModel?.label : "Select Model"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.value}
                  onSelect={handleSelect}
                >
                  {model.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === model.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}