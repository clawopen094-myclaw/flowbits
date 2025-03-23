"use server";

import prisma from "@/lib/prisma";
import {auth} from "@clerk/nextjs/server";

export async function getSystemVariable(){
    const {userId} = await auth();
    if (!userId){
        throw new Error("Unauthinticated!");
    }
    return prisma.systemVariables.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "asc",
        }
    });
}