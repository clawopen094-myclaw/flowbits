"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { workflowStatus, statuses } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { cn } from "@/lib/utils"
import { CoinsIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[120px]">
      <Link href={`/workflow/runs/${row.original.workflowId} /${row.getValue("id")}`} className="flex flex-col gap-0.5">
      {row.getValue("id")}
      <div className="flex items-center gap-4">
      <span className="text-sm font-semibold text-muted-foreground text-nowrap">triggered via</span>
      <Badge variant="outline" className="px-2 py-0"><span className="text-[10px] capitalize">{row.original.trigger}</span></Badge>
      </div>
      </Link>
    </div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const label = workflowStatus.find((label) => label.value === row.original.workflowStatus)

      return (
        <div className="flex">
        <Link href={`/workflow/runs/${row.original.workflowId} /${row.getValue("id")}`} className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </Link>
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon 
            style={status.value === "RUNNING" ? { animation: "spin 2s linear infinite" } : undefined} 
            className={cn("mr-2 h-4 w-4", status.color)} 
          />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "credits",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Credits" />
    ),
    cell: ({ row }) => <div className="w-[80px] flex gap-2 items-center">
      <span><CoinsIcon size={20} className="text-green-500"/></span>
      {row.getValue("credits")}
      </div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Started At" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{
      
      formatDistanceToNow(row.getValue("startTime"),{addSuffix:true})
      
      
      }</div>,
    enableSorting: false,
    enableHiding: false,
  }
]
