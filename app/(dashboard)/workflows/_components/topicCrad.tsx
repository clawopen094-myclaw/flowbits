"use client"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { WorkflowStatus } from "@/status/WorkflowStatus"
import { MoreVertical, Pencil, PlayIcon, Trash2, Workflow } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import DeleteWorkflowDialog from "./DeleteWorkflowDialog"
import { useRouter } from "next/navigation";


interface TopicCardProps {
  title: string
  description?: string
  status: string
  statuscolor: string
  date: string
  workflowId: string
  refresh: () => void
}

function handleRedirectToEditor(router: any, workflowId: string) {
  router.push(`/workflow/editor/${workflowId}`);
}

export default function TopicCard({
  title = "Add Topic Ideas and Links",
  description = "",
  status = WorkflowStatus.DRAFT,
  statuscolor = "warning",
  date = "Jan 28, 2025",
  workflowId,
  refresh
  
}: TopicCardProps) {
  const [showDeleteDialog,setShowDeleteDialog] = useState(false);
  const router = useRouter();


  return (

    <div className="bg-background border rounded-2xl">
    <div className="p-2 space-y-4">
      <div className="flex p-2 items-center justify-between border rounded-xl bg-gray-100/90 dark:bg-black dark:shadow-[0px_0px_10px_0px_#2D2D2D]">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary/10 text-primary flex items-center justify-center rounded font-medium">
              N
            </div>
            <div className="flex flex-col">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">
            {description}
            </p>
            </div>
          <Badge>{status}</Badge>

          </div>

          {/* <p className="text-sm text-muted-foreground">
            Created by: User A | Created on: Sep 8, 2020 | Expiring on: Oct 8, 2020
          </p> */}
        </div>
        <div className="flex items-center gap-5 ">
        <Switch className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500" id="airplane-mode" />

        <Button className="borde-1 dark:bg-accent dark:hover:bg-green-600" variant="outline">
          <PlayIcon/>
        </Button>
        <DeleteWorkflowDialog refresh={refresh} open={showDeleteDialog} setOpen={setShowDeleteDialog} workflowId={workflowId}/>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => handleRedirectToEditor(router, workflowId)}><Pencil/> Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 focus:text-red-600" onSelect={()=>{setShowDeleteDialog((prev)=>!prev);}}>
              <Trash2/> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </div>
  </div>
  )
}