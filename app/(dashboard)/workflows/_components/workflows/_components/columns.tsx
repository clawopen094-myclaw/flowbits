"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { workflowStatus } from "../data/data"
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
    accessorKey: "index",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[120px]">
      <Link href={`/workflow/editor/${row.original.id}`} className="flex flex-col gap-0.5">
      {row.getValue("index")}
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

      return (
        <div className="flex">
        <Link href={`/workflow/editor/${row.original.id}`} className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </Link>
        </div>
      )
    }
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex">
        <Link href={`/workflow/editor/${row.original.id}`} className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("description")}
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
      const status = workflowStatus.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status && <Badge variant="outline">{status.label}</Badge>}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{
      
      formatDistanceToNow(row.getValue("updatedAt"),{addSuffix:true})
      
      
      }</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "lastRunAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last run" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{
      formatDistanceToNow(row.getValue("lastRunAt"),{addSuffix:true})
      }</div>,
    enableSorting: false,
    enableHiding: false,
  }
]
