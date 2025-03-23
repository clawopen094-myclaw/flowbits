import { waitFor } from '@/lib/helper/waitFor';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import Editor from '../../_components/Editor';
import { cookies } from "next/headers"


async function page({params}:{params:{workflowId: string}}) {
    const {workflowId} = params;
    const {userId} = await auth();
    
    if (!userId) return <div>Unauthenticated</div>

    // await waitFor(5000)

    const results = await prisma.workflow.findUnique({
        where:{
            id: workflowId,
            userId,
        },
    });

    if (!results) return <div>Workflow not found</div>

    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
    
    return (
        <div>
            <Editor workflow={results} defaultOpen={defaultOpen}/>
        </div>
    )
}

export default page