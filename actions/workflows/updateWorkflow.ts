"use server";

import {auth} from "@clerk/nextjs/server"
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/status/WorkflowStatus";

export async function updateWorkflow({id,defination}:{id:string, defination: string}){

    const {userId} = await auth();

    if (!userId){
        throw new Error("Unauthenticated.")
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id,
        },
    })

    if (!workflow) throw new Error("Workflow not found.")
    if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("Workflow is not a Draft.")
    }

    await prisma.workflow.update({
        data:{
            defination,
        },
        where:{
            id,
            userId
        }
    })
}