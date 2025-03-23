import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { ArrowDownToDot, Copy, Ellipsis, EllipsisVertical, Save, Trash2 } from "lucide-react"

export function NodeSettingsDropdownMenu({isEntryPoint}:{isEntryPoint:boolean}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='h-7 px-1' variant="ghost" size="xs">
            <EllipsisVertical/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background dark:bg-[#141414]">
        <DropdownMenuGroup> 

          <DropdownMenuItem>
            <Save/> Save
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Copy/> Duplicate
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>

          {isEntryPoint && ( 
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ArrowDownToDot/> Starting Node
            <DropdownMenuShortcut className="opacity-100"><Switch size="sm" id="node-starting-point" /></DropdownMenuShortcut>
          </DropdownMenuItem>
          )}
        
          <DropdownMenuItem className="focus:text-red-600">
            <Trash2/>  Delete
          </DropdownMenuItem>

        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
