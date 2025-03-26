import { AppNode } from "@/types/appNode";
import { TaskoutputParam, TaskParams } from "@/types/type";
import { LucideProps } from "lucide-react";

export enum WorkflowStatus{
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
    label: string;
    description: string;
    icon: (props: LucideProps) => JSX.Element;
    type: string;
    isEntryPoint: boolean;
    credits?: number;
    height: number;
    width: number;
    inputs: TaskParams[];
    outputs: TaskoutputParam[];
    tools?: TaskParams[];
}

export type WorkflowExecutionPlanPhase = {
    phase: number;
    nodes: AppNode[];
};

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];



export enum WorkflowExecutionStatus {
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export enum ExecutionPhaseStatus {
    CREATED = "CREATED",
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export enum WorkflowExecutionTrigger {
    MANUAL = "MANUAL",
    CRON = "CRON"
}