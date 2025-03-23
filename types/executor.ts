import { WorkflowTask } from "@/status/WorkflowStatus"
import { LogCollector } from "./logs"

export type Environment = {
    phases: Record<string,{
            inputs: Record<string,string>
            outputs: Record<string,string> 
        }>
    }   

export type ExecutionEnvironment<T extends WorkflowTask> = {
    getInput(name: T['inputs'][number]['name']): string;
    setOutputs(name: T['outputs'][number]['name'],value:string): void;
    log: LogCollector;
}