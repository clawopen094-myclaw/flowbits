"use server";


import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/status/WorkflowStatus";
import { period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";


const {COMPLETED,FAILED} = WorkflowExecutionStatus

export default async function GetStatusCardValue(period:period){
    
    const {userId} = await auth();
    
    if (!userId){
        throw new Error("Unauthenticated")
    }
    
    const dateRange = PeriodToDateRange(period)

    const executions = await prisma.workflowExecution.findMany({
        where:{
            userId,
            startedAt:{
                gte: dateRange.startDate,
                lte: dateRange.endDate
            },

            status:{
                in: [COMPLETED,FAILED]
            }
        },
        select:{
            creditsConsumed: true,
            phases: {
                where:{
                    creditsCost:{
                        not: null,
                    }
                },
                select:{
                    creditsCost: true
                }
            }
        }
    })


    const stats = {
        workflowExecutions : executions.length,
        creditsConsumed: 0,
        phaseExecutions: 0
    }

    stats.creditsConsumed = executions.reduce(
        (sum,executions)=> sum + executions.creditsConsumed,0
    )

    stats.phaseExecutions = executions.reduce(
        (sum,executions)=> sum + executions.phases.length,0
    )

    return stats
}