"use server";

import { createWorkflowSchema,createWorkflowSchemaType } from "@/schemas/workflows";
import {auth} from "@clerk/nextjs/server"
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/status/WorkflowStatus";
import { redirect } from "next/navigation";

export async function createWorkflow(form: createWorkflowSchemaType){
    const {success,data} = createWorkflowSchema.safeParse(form)
    if (!success){
        throw new Error("Invalid form data.")
    }

    const {userId} = await auth();

    if (!userId){
        throw new Error("Unauthenticated.")
    }

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            defination: "{}",
            ...data,
        },
    })

    if (!result){
        throw new Error("Failed to create Workflow.")
    }

    redirect(`/workflow/editor/${result.id}`)
}