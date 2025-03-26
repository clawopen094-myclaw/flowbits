// app/api/workflows/cron/route.ts
import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/status/WorkflowStatus";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const now = new Date();
    try {
        const workflows = await prisma.workflow.findMany({
            select: { id: true },
            where: {
                status: WorkflowStatus.PUBLISHED,
                cron: { not: null },
                nextRunAt: { lte: now }
            }
        });

        for (const workflow of workflows) {
            triggerWorkflow(workflow.id);
        }

        return NextResponse.json({ workflows: workflows.length }, { status: 200 }); // Use NextResponse
    } catch (error) {
        console.error("Error in /api/workflows/cron:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 }); // Handle errors properly
    }
}
``

function triggerWorkflow(workflowId: string) {
    const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${workflowId}`);
    console.log("Requesting URL:", triggerApiUrl);
    fetch(triggerApiUrl,{
        headers: {
            Authorization: `Bearer ${process.env.SECRET_KEY!}`
        },
        cache: "no-store",
        signal: AbortSignal.timeout(120000)
    }).catch((error)=>console.error("Error Triggering workflowId:",workflowId,"Error:",error.message))
}