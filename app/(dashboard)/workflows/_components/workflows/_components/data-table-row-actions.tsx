"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { taskSchema } from "../data/schema"
import DeleteWorkflowDialog from "../../DeleteWorkflowDialog"
import { useState } from "react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  refresh: ()=> void
}

export function DataTableRowActions<TData>({
  row,
  refresh
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)
  const [open,setOpen] = useState(false)
  return (<>
    <DeleteWorkflowDialog open={open} setOpen={setOpen} workflowId={task.id} refresh={refresh}/>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem> */}
        <DropdownMenuItem onSelect={()=>{setOpen((prev)=>!prev);}}>
          <span className="text-red-500">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}
