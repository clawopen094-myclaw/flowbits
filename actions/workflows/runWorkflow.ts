"use server";

import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger, WorkflowStatus } from "@/status/WorkflowStatus";
import { auth } from "@clerk/nextjs/server";
import { GetAvailableCredits } from "../billing/getAvailableCredits";

export async function runWorkflow(form:{workflowId: string,flowDefinitaoin?: string}) {

    const {userId} = await auth();

    if (!userId){
        throw new Error("Unauthenticated.")
    }

    const {workflowId, flowDefinitaoin} = form

    if (!workflowId){
        throw new Error("Workflow id not found.")
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id: workflowId
        }
    })

    if (!workflow){
        throw new Error("Workflow not found.")
    }

    let executionPlan: WorkflowExecutionPlan
    let workflowDefinition = flowDefinitaoin

    if (workflow.status === WorkflowStatus.PUBLISHED){
        if (!workflow.executionPlan){
            throw new Error("Execution plan not found in the published workflow.")
        }
        executionPlan = JSON.parse(workflow.executionPlan!)
        workflowDefinition = workflow.defination
    }else{
        if (!flowDefinitaoin){
            throw new Error("Flow definition not found.")
        }

        const flow = JSON.parse(flowDefinitaoin)
        const result = FlowToExecutionPlan(flow.nodes, flow.edges)
    
        if (result.error){
            throw new Error("FLow definition is not valid.")
        }
        
        if (!result.executionPlan){
            throw new Error("No execution plan generated.")
        }
        
        executionPlan = result.executionPlan
    }
    
    const coinsRequired = executionPlan.flatMap((phase)=>{
        return phase.nodes.flatMap((node)=>{
            return TaskRegistry[node.data.type].credits
        })
    }).reduce((sum, value) => sum + value, 0);


    const userCreditBalance = await GetAvailableCredits();

    if (userCreditBalance < coinsRequired){
        throw new Error("Insufficient credit balance.")
    }

    const execution = await prisma.workflowExecution.create({
        data:{
            workflowId,
            userId,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: WorkflowExecutionTrigger.MANUAL,
            definition: workflowDefinition,
            phases: {
                create: executionPlan.flatMap((phase)=>{
                    return phase.nodes.flatMap((node)=>{
                        return {
                            userId,
                            status: ExecutionPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label,
                            creditsCost: TaskRegistry[node.data.type].credits,
                        }
                    })
                })
            },
        },
        select: {
            id: true,
            phases: true

        }
    })

    if (!execution){
        throw new Error("Workflow execution not created.")
    }
    ExecuteWorkflow(execution.id)
    return execution.id
}

