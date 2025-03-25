"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { workflowStatus } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { DataTableRowActions } from "./data-table-row-actions"
import DataTableSchedule from "./data-table-schedule"
import { WorkflowStatus } from "@/status/WorkflowStatus"


export const columns = (refresh: () => void): ColumnDef<Task>[] => [
  {
    accessorKey: "index",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[30px]">
      <Link href={`/workflow/editor/${row.original.id}`} className="flex flex-col gap-0.5">
      {row.getValue("index")}
      </Link>
    </div>,
    enableSorting: false,
    enableHiding: false
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
        <div className="flex w-[60px] items-center">
          {status && <Badge variant="outline">{status.label}</Badge>}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex flex-col gap-1">
        <Link href={`/workflow/editor/${row.original.id}`} className="flex space-x-2">
          <span className="max-w-[300px] truncate font-medium overflow-hidden">
            {row.getValue("name")}
          </span>
        </Link>
        <DataTableSchedule id={row.original.id} isDraft={row.original.status === WorkflowStatus.DRAFT} creditsCost={row.original.creditsCost || 0} cron={row.original.cron} refresh={refresh}/>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
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
          <span className="max-w-[300px] truncate font-medium overflow-hidden">
            {row.getValue("description")}
          </span>
        </Link>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("updatedAt") ? formatDistanceToNow(row.getValue("updatedAt"),{addSuffix:true}) : "Never"}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "lastRunAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last run" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{
      row.getValue("lastRunAt") ? formatDistanceToNow(row.getValue("lastRunAt"),{addSuffix:true}) : "Never"
      }</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} refresh={refresh} />,
  },
]
