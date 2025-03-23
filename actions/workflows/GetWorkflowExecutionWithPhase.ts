"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


export async function GetWorkflowExecutionWithPhase(executionId:string){
    const userId = await auth();

    if (!userId){
        throw new Error("Unauthenticated")
    }

    return prisma.workflowExecution.findUnique({
        where:{
            id:executionId
        },
        include:{
            phases: {
                orderBy:{
                    number: "asc"
                }
            }
        }
    })
}