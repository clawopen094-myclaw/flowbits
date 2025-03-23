import { Card } from '@/components/ui/card'
import { Workflow } from '@prisma/client'
import React from 'react'
import TopicCard from './topicCrad'
import { WorkflowStatus } from "@/status/WorkflowStatus"


const statuscolors = {
    [WorkflowStatus.DRAFT]: "warning",
    [WorkflowStatus.PUBLISHED]: "success",
}


function WorkflowCard({workflow,refresh}:{workflow:any,refresh:()=>void}) {
  return (
    <div>
        <TopicCard 
        title={workflow.name}
        description={workflow.description ?? ""}
        status={workflow.status}
        workflowId={workflow.id}
        statuscolor={statuscolors[workflow.status as WorkflowStatus]}
        date={new Date(workflow.createdAt).toLocaleDateString()}
        refresh={refresh}
        />
    </div>
  )
}

export default WorkflowCard