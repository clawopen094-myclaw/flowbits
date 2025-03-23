import { WorkflowTask } from "@/status/WorkflowStatus";
import { ExecutionEnvironment } from "@/types/executor";
import { TaskType } from "@/types/type";
import axios from "axios";

export async function InputExecutor(environment: ExecutionEnvironment<WorkflowTask & { type: TaskType.INPUT }>): Promise<boolean> {
    
    try{
        const input = environment.getInput('Input')
        environment.setOutputs('Response', input)
        return true;
    }catch (error){
        environment.log.error(error as string)
        return false;
    }

}