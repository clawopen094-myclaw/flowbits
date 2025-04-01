"use server";

import prisma from "@/lib/prisma";
import { period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";


export default async function getPeriods(){
    const {userId} = await auth();

    if (!userId){
        throw new Error("Unauthenticated")
    }

    const years = await prisma.workflowExecution.aggregate({
        where:{userId},
        _min: {startedAt: true}
    })

    const curYear = new Date().getFullYear()

    const minYear = years._min.startedAt ? years._min.startedAt.getFullYear() : curYear
    const minMonth = years._min.startedAt?.getMonth()
    const periods: period[] = []

    for (let year = minYear;year<=curYear;year++){
        for (let month = 0;month<=11;month++){
            periods.push({year,month})
        }
    }

    return periods
}