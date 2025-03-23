"use client";

import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import { runWorkflow } from "@/actions/workflows/runWorkflow";
import { UnpublishWorkflow } from "@/actions/workflows/unpublishWorkflow";
import { updateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { ArrowLeft, DownloadIcon, Play, Save, UploadIcon } from "lucide-react";
import { toast } from "sonner";

function BottomBar({id,name,description,status,isPublished}:{id:string,name:string,description:string|null,status:string,isPublished:boolean}) {
    const {toObject} = useReactFlow();
    const saveMutation = useMutation({
        mutationFn: updateWorkflow,
        onSuccess: ()=>{toast.success("Workflow saved",{id: "workflow-save"})},
        onError: ()=> {toast.error("Something went wrong",{id: "workflow-save"})}
    })

    const executeMutaiton = useMutation({
        mutationFn: runWorkflow,
        onSuccess: (executionId)=>{
            window.open(`/workflow/runs/${id}/${executionId}`, "_blank", "noopener,noreferrer");
            toast.success("Execution Started",{id:"execution-start"})
        },
        onError: (error)=> {
            toast.error(error.message,{id:"execution-start"})
        }
    })

    const publishMutaiton = useMutation({
        mutationFn: PublishWorkflow,
        onSuccess: ()=>{
            toast.success("Workflow Published",{id:id})
        },
        onError: ()=> {
            toast.error("Something went wrong.",{id:id})
        }
    })

    const unpublishMutaiton = useMutation({
        mutationFn: UnpublishWorkflow,
        onSuccess: ()=>{
            toast.success("Workflow Unpublished",{id:id})
        },
        onError: ()=> {
            toast.error("Something went wrong.",{id:id})
        }
    })
    
    const generate = useExecutionPlan();

  return (
    <div className='fixed left-1/2 -translate-x-1/2 bottom-0 flex justify-center items-center p-2'>
        <div className="relative -translate-y-2">
        <div className="flex flex-col xl:flex-row bg-background dark:bg-[#141414] border rounded-lg p-1.5 gap-2 xl:gap-10">
            <div className="flex flex-1 justify-center items-center gap-3 ">
                <Button variant="outline" size="sm" onClick={()=>{window.location.href = '/workflows'}}><ArrowLeft size={16}/></Button>
                <div className="flex flex-col px-1 w-[250px]">
                    <p className="text-sm font-bold flex items-center gap-2">
                    <span className="whitespace-nowrap overflow-hidden">{name}</span>
                    <Badge variant="outline" className="py-0">{status}</Badge>    
                    </p>
                    {description && (<p className="text-sm text-muted-foreground whitespace-nowrap overflow-hidden">{description}</p>)}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" disabled={executeMutaiton.isPending} size="sm" onClick={()=>{
                    const plan = generate();
                    const workflowDefinition = JSON.stringify(toObject())
                    if (!plan){
                        return ;
                    }

                    executeMutaiton.mutate({
                        workflowId: id,
                        flowDefinitaoin: workflowDefinition
                    })
                }}>
                <Play/> Execute
                </Button>
                {isPublished && (
                        <Button disabled={unpublishMutaiton.isPending} variant="outline" size="sm" onClick={()=>{
                            toast.loading("Unpublishing workflow...",{id:id})
                            unpublishMutaiton.mutate(id)
                        }}>
                        <DownloadIcon/> Unpublish
                        </Button>      
                )}
                {!isPublished && (
                    <>
                        <Button disabled={saveMutation.isPending} variant="outline" size="sm" onClick={()=>{
                            const workflowDefinition = JSON.stringify(toObject())
                            toast.loading("Saving workflow...",{id:"workflow-save"})
                            saveMutation.mutate({
                                id: id,
                                defination: workflowDefinition
                            })
                        }}>
                        <Save/> Save
                        </Button>
                        <Button disabled={publishMutaiton.isPending} variant="outline" size="sm" onClick={()=>{
                            const workflowDefinition = JSON.stringify(toObject())
                            toast.loading("Publishing workflow...",{id:id})
                            publishMutaiton.mutate({
                                id: id,
                                flowDefinition: workflowDefinition
                            })
                        }}>
                        <UploadIcon/> Publish
                        </Button>                    
                    </>
                )}


            </div>
        </div>
        </div>
    </div>
  )
}

export default BottomBar