import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/status/WorkflowStatus";
import { period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";
import { executionPhase } from "@prisma/client";

type Stats = Record<string,{success:number,failed:number}>

const {COMPLETED,FAILED} = ExecutionPhaseStatus;

export async function getCreditsUsageInPeriod(period:period){
    const {userId} = await auth();
    if (!userId){
        throw new Error("Unauthenticated")
    }   

    const dateRange = PeriodToDateRange(period)
    const dateFormat = "yyyy-MM-dd"
    const executionPhases: executionPhase[] = await prisma.executionPhase.findMany({
        where:{
            userId,
            startedAt:{
                gte: dateRange.startDate,
                lte: dateRange.endDate
            },
            status:{
                in: [COMPLETED,FAILED]
            }
        }
    })

    const stats: Stats = eachDayOfInterval({start: dateRange.startDate,end: dateRange.endDate}).map((date)=> format(date,dateFormat)).reduce((acc,date)=>{
        acc[date] = {
            success: 0,
            failed: 0
        };
        return acc;
    }, {} as Record<string, {success: number, failed: number}>)

    executionPhases.forEach((phase) => {
        const date = format(phase.startedAt!,dateFormat)
        if (phase.status === COMPLETED){
            stats[date].success += phase.creditsCost || 0
        }
        if (phase.status === FAILED){
            stats[date].failed += phase.creditsCost || 0
        }
    })

    const result = Object.entries(stats).map(([ date, infos ])=>({ date, ...infos }))

    return result
}