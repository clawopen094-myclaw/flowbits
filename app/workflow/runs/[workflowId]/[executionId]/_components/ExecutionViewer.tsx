"use client";

import { GetWorkflowExecutionWithPhase } from "@/actions/workflows/GetWorkflowExecutionWithPhase"
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatesToDurationString } from "@/lib/helper/dates";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/status/WorkflowStatus";
import * as ReactQuery from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Calendar, CircleDotDashed, Clock3, CoinsIcon, Loader, LucideIcon, WorkflowIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import StringExpander from "@/app/workflow/_components/nodes/params/StringExpander";
import { LogsComponent } from "@/app/(dashboard)/workflows/_components/LogsComponent";
import {PhaseStatusBadge,WorkflowStatusBadge} from "./PhaseStatusBadge";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhase>>;

function ExecutionViewer({initialData}:{initialData: ExecutionData}) {
    const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
    const query = ReactQuery.useQuery({
        queryKey:["execution",initialData?.id],
        initialData,
        queryFn: () => GetWorkflowExecutionWithPhase(initialData!.id),
        refetchInterval: (q)=>q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false
    });

    const phaseDetails = ReactQuery.useQuery({
        queryKey: ["phaseDetails",selectedPhase],
        enabled: selectedPhase !== null,
        queryFn: ()=> GetWorkflowPhaseDetails(selectedPhase!)
    })

    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

    useEffect(()=>{
        const phases = query.data?.phases || [];
        if (isRunning){
            const phaseToSelect = phases.toSorted((a,b)=> a.startedAt! > b.startedAt! ? -1:1)[0];
            setSelectedPhase(phaseToSelect.id);
            return ;
        }
        const phaseToSelect = phases.toSorted((a,b)=> a.completedAt! > b.completedAt! ? -1:1)[0];
        setSelectedPhase(phaseToSelect.id);
    },[query.data?.phases,isRunning,setSelectedPhase ])

    const duration = DatesToDurationString(query.data?.startedAt,query.data?.completedAt)
  return (
    <div className="flex h-full w-full">
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-r border-separate flex flex-grow flex-col overflow-hidden">
    <div className="py-4 pl-4">
        <ExecutionLabel icon={CircleDotDashed} label="Status" value={
        <div className="flex items-center gap-1">
        <WorkflowStatusBadge status={query.data?.status as WorkflowExecutionStatus}/>
        {query.data?.status}
        </div>
        }/>
        <ExecutionLabel icon={Calendar} label="Started at" value={<span className="lowercase">{query.data?.startedAt ? formatDistanceToNow(new Date(query.data?.startedAt),{addSuffix:true}) : "-"}</span>}/>
        <ExecutionLabel icon={Clock3} label="Duration" value={<span className="lowercase">{duration ? duration : <Loader size={16} style={{animation: "spin 2s linear infinite"}} className="ease-linear text-primary" />}</span>}/>
        <ExecutionLabel icon={CoinsIcon} label="Credits consumed" value={<ReactCountUpWrapper value={query.data?.creditsConsumed || 0}/>}/>
    </div>
    <Separator/>
    <div className="flex justify-center items-center py-2 px-4">
        <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80"/>
            <span className="font-semibold">Phases</span>
        </div>
    </div>
    <Separator/>
    <div className="overflow-auto h-full px-2 py-4">
        {query.data?.phases.map((phase,index)=>(
            <Button key={phase.id} variant={selectedPhase === phase.id ? "secondary" : "ghost"} className="w-full justify-between"
            onClick={()=>{
                if (isRunning) return;
                setSelectedPhase(phase.id)
            }}>
                <div className="flex items-center gap-2">
                <Badge variant="outline">
                    <p className="text-primary">{phase.number}</p>
                </Badge>
                <p className="font-semibold text-center">
                    {phase.name}
                </p>
                </div>
                <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus}/>
            </Button>
        ))}
    </div>
    </aside>
    <div className="flex h-full w-full">
        {isRunning && (
            <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
                <div className="flex items-center gap-2">
                <Loader size={16} style={{animation: "spin 2s linear infinite"}} className="ease-linear text-primary" />
                <p className="font-bold text-sm">Run in progress, please wait.</p>
                </div>
            </div>
        )}

        {!isRunning && !selectedPhase && (
            <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
                <div className="flex flex-col gap-1 text-center">
                    <p className="font-bold text-sm">No phase selected</p>
                    <p className="text-sm text-muted-foreground">Select a phase to view details</p>
                </div>
            </div>
        )}

        {!isRunning && selectedPhase && phaseDetails.data && (
            <div className="flex flex-col py-4 container gap-4 overflow-auto">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="space-x-4">
                        <div className="flex gap-1 items-center">
                            <CoinsIcon size={14} className="stroke-muted-foreground"/>
                            <span>Credits</span>
                        </div>
                        <span>{phaseDetails.data.creditsCost}</span>
                    </Badge>
                    <Badge variant="outline" className="space-x-4">
                        <div className="flex gap-1 items-center">
                            <Clock3 size={14} className="stroke-muted-foreground"/>
                            <span>Duration</span>
                        </div>
                        <span>{DatesToDurationString(phaseDetails.data.startedAt,phaseDetails.data.completedAt)}</span>
                    </Badge>
                </div>

                <ParameterViewer title="Inputs" subtitle="Inputs used for this phase" paramsJSON={phaseDetails.data.inputs}/>
                <ParameterViewer title="Outputs" subtitle="Outputs generated by this phase" paramsJSON={phaseDetails.data.outputs}/>
                
                <div className="h-auto">
                <LogsComponent logs={phaseDetails.data.logs}/>
                </div>

            </div>
        )}

    </div>
    </div>
  )
}

export default ExecutionViewer


function ExecutionLabel({icon,label,value,status}:{icon:LucideIcon,label:ReactNode,value: ReactNode,status?:WorkflowExecutionStatus}){
    const Icon = icon;
    return (
        <div className="flex justify-between items-center py-2 px-4 text-sm">
        <div className="text-muted-foreground flex items-center gap-2">
            <Icon size={20} className="text-muted-foreground/80"/>
            <span>{label}</span>
        </div>
        <div className="font-semibold text-sm uppercase flex gap-2 items-center">
            {value}
        </div>
    </div>
    )
}


function ParameterViewer({title,subtitle,paramsJSON}:{title:string,subtitle:string,paramsJSON:string|null}){
    const params = paramsJSON ? JSON.parse(paramsJSON) : undefined;
    return <Card>
        <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
            <div className="flex flex-col gap-2">
                { (!params || Object.keys(params).length === 0) && (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm">No parameters found.</p>
                    </div>
                )}

                {params && Object.entries(params).map(([key,value])=>(
                    <div key={key} className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground flex-1 basis-1/3">{key}</p>
                        <Input readOnly className="flex-1 basis-2/3 pr-[33px]" value={value as string}/>
                        <StringExpander mode="View" name={key} value={value as string} disabled={false} className="relative right-8"/>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
}
