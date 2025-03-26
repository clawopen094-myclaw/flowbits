import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/status/WorkflowStatus";
import { timingSafeEqual } from "crypto";


function isValidSecret(secret:string){
    const api_secret = process.env.SECRET_KEY
    if (!api_secret) return false;
    
    try {
        return timingSafeEqual(Buffer.from(secret),Buffer.from(api_secret))
    } catch (error) {
        return false
    }
}


export async function GET(request: Request){
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return Response.json({ error: "Unauthorized" },{ status: 401 })
    }

    const secret = authHeader.split(" ")[1]
    if (!isValidSecret(secret)){
        return Response.json({ error: "Unauthorized" },{ status: 401 })
    }

    const {searchParams} = new URL(request.url)
    const workflowId = searchParams.get("workflowId") as string;

    if (!workflowId) {
        return Response.json({ error: "Bad request" },{ status: 400 })
    }

    const workflow = await prisma.workflow.findUnique({
        where:{
            id: workflowId
        }
    })

    if (!workflow) {
        return Response.json({ error: "Bad request" },{ status: 400 })
    }

    const executionPlan = JSON.parse(workflow.executionPlan!) as WorkflowExecutionPlan

    if (!executionPlan){
        return Response.json({ error: "No workflow execution plan found" },{ status: 400 })
    }

    const execution = await prisma.workflowExecution.create({
        data:{
            workflowId,
            userId: workflow.userId,
            definition: workflow.defination,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: WorkflowExecutionTrigger.CRON,
            phases: {
                create: executionPlan.flatMap((phase)=>{
                    return phase.nodes.flatMap((node)=>{
                        return {
                            userId:workflow.userId,
                            status: ExecutionPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label,
                            creditsCost: TaskRegistry[node.data.type].credits,
                        }
                    })
                })
            },
        }
    })

    await ExecuteWorkflow(execution.id)
    return new Response(null,{ status: 200 })
}