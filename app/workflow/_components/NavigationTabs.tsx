"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PencilLine, Play } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

function NavigationTabs({ workflowId }: { workflowId: string }) {
    const pathName = usePathname()
    const activeValue = pathName.split("/")[2];
    return (
        <Tabs
            className="absolute top-8 z-10 left-1/2 transform -translate-x-1/2 w-[230px]"
            value={activeValue}
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor" className="gap-1" onClick={()=>window.location.href=`/workflow/editor/${workflowId}`}>
                    <Link href={`/workflow/runs/${workflowId}`} className="flex items-center gap-1 !p-0 !m-0"><PencilLine size={16} />{" "}Editor</Link>
                </TabsTrigger>
                <TabsTrigger value="runs" className="gap-1" onClick={()=>window.location.href=`/workflow/runs/${workflowId}`}>
                    <Link href={`/workflow/runs/${workflowId}`} className="flex items-center gap-1 !p-0 !m-0"><Play size={16} />{" "}Executions</Link>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

export default NavigationTabs