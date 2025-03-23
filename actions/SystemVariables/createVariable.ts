"use server";

import { createSystemVariable,createSystemVariableType } from "@/schemas/SystemVariable";
import {auth} from "@clerk/nextjs/server"
import prisma from "@/lib/prisma";

export async function createVariable(form: createSystemVariableType){
    const {success,data} = createSystemVariable.safeParse(form)
    if (!success){
        throw new Error("Invalid form data.")
    }

    const {userId} = await auth();

    if (!userId){
        throw new Error("Unauthenticated.")
    }

    const result = await prisma.systemVariables.create({
        data: {
            userId,
            ...data
        },
    })

    if (!result){
        throw new Error("Failed to create Workflow.")
    }

}