import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/status/WorkflowStatus'
import { CircleCheckIcon, CircleDashedIcon, CircleXIcon, Loader } from 'lucide-react'
import React from 'react'

function PhaseStatusBadge({status}:{status:ExecutionPhaseStatus}) {
    switch (status){
        case ExecutionPhaseStatus.PENDING:
            return <CircleDashedIcon size={20} className='stroke-muted-foreground'/>
        case ExecutionPhaseStatus.RUNNING:
            return <Loader size={20} style={{animation: "spin 2s linear infinite"}} className="ease-linear text-primary stroke-yellow-500" />
        case ExecutionPhaseStatus.COMPLETED:
            return <CircleCheckIcon size={20} className='stroke-green-500'/>
        case ExecutionPhaseStatus.FAILED:
            return <CircleXIcon size={20} className='stroke-red-500'/>
    }
}


function WorkflowStatusBadge({status}:{status:WorkflowExecutionStatus}) {
    switch (status){
        case WorkflowExecutionStatus.PENDING:
            return <CircleDashedIcon size={20} className='stroke-muted-foreground'/>
        case WorkflowExecutionStatus.RUNNING:
            return <Loader size={20} style={{animation: "spin 2s linear infinite"}} className="ease-linear text-primary stroke-yellow-500" />
        case WorkflowExecutionStatus.COMPLETED:
            return <CircleCheckIcon size={20} className='stroke-green-500'/>
        case WorkflowExecutionStatus.FAILED:
            return <CircleXIcon size={20} className='stroke-red-500'/>
    }
}

export {PhaseStatusBadge, WorkflowStatusBadge}
