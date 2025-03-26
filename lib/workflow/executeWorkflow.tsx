import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/status/WorkflowStatus";
import { waitFor } from "../helper/waitFor";
import { executionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { Log, LogCollector } from "@/types/logs";
import { log } from "console";
import { createLogCollector } from "../log";
import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { toast } from "sonner";


export async function ExecuteWorkflow(executionId:string){
    const execution  = await prisma.workflowExecution.findUnique({
        where:{
            id: executionId
        },
        include: {workflow:true,phases:true},
    })

    if (!execution){
        throw new Error("No workflow found.")
    }

    const environment = { phases:{} };
    await initializeWorkflowExecution(executionId,execution.workflowId);
    await initializePhaseStatus(execution);
    let creditsConsumed = 0;
    let executionFailed = false;
    let totalCreditsRequired = 0
    for (const phase of execution.phases){
        totalCreditsRequired += phase.creditsCost || 0;
    }
    
    const userCreditBalance = await GetAvailableCredits();
    if (userCreditBalance > totalCreditsRequired){
        for (const phase of execution.phases){
            const phaseExecution = await executeWorkflowPhase(environment,phase,execution)
            creditsConsumed += phaseExecution.creditsConsumed
            if (!phaseExecution.success){
                executionFailed = true
                break;
            }
        }
    }else{
        executionFailed = true;
    }

    await finalizeWorkflowExecution(executionId,execution.workflowId,executionFailed,creditsConsumed);

    //TODO: cleanup the environment

    revalidatePath("/workflows/runs")
}


async function initializeWorkflowExecution(executionId:string,workflowId:string){
    await prisma.workflowExecution.update({
        where:{
            id: executionId
        },
        data:{
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING
        }
    })

    await prisma.workflow.update({
        where: {id: workflowId},
        data:{
            lastRunAt: new Date(),
            lastRunId: executionId,
            lastRunStatus: WorkflowExecutionStatus.RUNNING
        }
    })
}


async function initializePhaseStatus(execution:any){
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase: any) => phase.id)
            }
        },
        data: {
            status: ExecutionPhaseStatus.PENDING
        }
    });
}

async function finalizeWorkflowExecution(executionId:string,workflowId:string,executionFailed:boolean,creditsConsumed:number){
    const finalStatus= executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED
    await prisma.workflowExecution.update({
        where:{
            id: executionId
        },
        data:{
            status: finalStatus,
            completedAt: new Date(),
            creditsConsumed: creditsConsumed
        }
    })

    await prisma.workflow.update({
        where:{
            id: workflowId,
            lastRunId: executionId,
        },
        data:{
            lastRunStatus: finalStatus
        }
    }).catch((err)=>{
        //ignore
        //this means we have triggered another execution while an execution was running.
    })
}


async function executeWorkflowPhase(environment:Environment,phase:executionPhase,execution:any){
    
    const logCollector = createLogCollector();
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode
    setupExecutionEnvironment(node,environment,execution)

    await prisma.executionPhase.update({
        where:{
            id: phase.id
        },
        data:{
            status: ExecutionPhaseStatus.RUNNING,
            startedAt: startedAt,
            inputs: JSON.stringify(environment.phases[node.id].inputs)
        }
    })

    const creditRequired = TaskRegistry[node.data.type]?.credits;
    console.log(`Execution phase ${phase.name} requires ${creditRequired} credits.`)
    let success = await decrementCredits(execution.userId,creditRequired,logCollector);
    const creditsConsumed = success ? creditRequired : 0;
    if (success){
        success = await executePhase(environment,phase,node,logCollector);
    }
    const outputs = environment.phases[node.id].outputs

    await finalizePhase(phase.id,success,outputs,logCollector,creditsConsumed)
    return {success,creditsConsumed}
}


async function finalizePhase(phaseId:string,success:boolean, outputs:any, logCollector:LogCollector,creditsConsumed:number){
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;
    await prisma.executionPhase.update({
        where:{
            id: phaseId
        },
        data:{
            status: finalStatus,
            completedAt: new Date(),
            outputs: JSON.stringify(outputs),
            creditsCost: creditsConsumed,
            logs: {
                createMany: {
                    data: logCollector.getAll().map((log)=>({
                        message: log.message,
                        timestamp: log.timestamp,
                        logLevel: log.level,
                    }))
                }
            }
        }
    })
}


async function executePhase(environment:Environment,phase:executionPhase,node:AppNode,logCollector:LogCollector):Promise<boolean>{
    const runFn = ExecutorRegistry[node.data.type]
    if (!runFn){
        return false
    }
    const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(environment,node,logCollector)
    return await runFn(executionEnvironment);
}


async function setupExecutionEnvironment(node:AppNode,environment:Environment,execution:any){
    environment.phases[node.id] = {inputs:{},outputs:{}}
    const inputs = TaskRegistry[node.data.type]?.inputs;
    for (const input of inputs){
        const inputValue = node.data.inputs[input.name]
        if (inputValue){
            environment.phases[node.id].inputs[input.name] = inputValue
            continue
        }
        // else setup value from the previous node.
        

        const edges = JSON.parse(execution.workflow.defination).edges
        const nodes = JSON.parse(execution.workflow.defination).nodes

        // Find the previous node by checking the 'edges' array
        const previousEdge = edges.find(
            (edge:any) => edge.target === node.id && edge.targetHandle === input.name
        );

        if (previousEdge) {
            const previousNodeId = previousEdge.source;
            const sourceNode = nodes.find(
                (n:any) => n.id === previousNodeId
            );

            const sourceOutput = environment.phases[sourceNode.id]?.outputs[previousEdge.sourceHandle];
            
            // Handle the case where source data is needed
            if (sourceOutput) {
                environment.phases[node.id].inputs[input.name] = sourceOutput;
            }
        }
    }
}

function createExecutionEnvironment(environment:Environment,node:AppNode,logCollector:LogCollector){
    return {
        getInput: (name:string) => environment.phases[node.id]?.inputs[name],
        setOutputs: (name:string,value:string)=> {
            environment.phases[node.id].outputs[name] = value

        },
        log: logCollector,
    }
}

async function decrementCredits(userId:string,credits:number,logCollector: LogCollector){
    try{
        await prisma.userBalance.update({
            where:{
                userId,
                credits:{
                    gte: credits
                }
            },
            data:{
                credits:{
                    decrement: credits
                }
            }
        })
        return true
    }catch(error){
        logCollector.error("Insufficent balance")
        return false;
    }
}