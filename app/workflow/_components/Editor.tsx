"use client"

import { Workflow } from '@prisma/client'
import React from 'react'
import {ReactFlowProvider} from "@xyflow/react"
import FlowEditor from './FlowEditor'
import { ComponentsSidebar } from '../_components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CustomTrigger } from './SidebarToogleButton'
import { FlowValidationContextProvider } from '@/components/context/FlowValidationContext'


function Editor({workflow,defaultOpen}:{workflow:Workflow,defaultOpen:boolean}) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <FlowValidationContextProvider>
    <SidebarProvider open={open} onOpenChange={setOpen}>
    <ComponentsSidebar/>
    {!open && (<CustomTrigger/>)}
    <ReactFlowProvider>
        <div className="flex p-2 flex-col h-full w-full overflow-hidden">
            <section className='flex h-full overflow-auto'>
                <FlowEditor workflow={workflow}/>
            </section>
        </div>
    </ReactFlowProvider>
    </SidebarProvider>
</FlowValidationContextProvider>
  )
}

export default Editor
