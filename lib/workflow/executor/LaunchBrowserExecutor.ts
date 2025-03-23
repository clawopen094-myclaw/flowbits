import { ExecutionEnvironment } from "@/types/executor";
import axios from "axios";
import { WorkflowTask } from "@/status/WorkflowStatus";
import { TaskType } from "@/types/type";

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<WorkflowTask & { type: TaskType.LAUNCH_BROWSER }>): Promise<boolean> {
    const inputValue = environment.getInput('Website Url')
    const response = await axios.post(`${process.env.NEXT_DBU}/api/executephase`, {inputs:{'Website Url':inputValue},type:TaskType.LAUNCH_BROWSER}, {
        headers: { "Content-Type": "application/json" }
    });
    environment.setOutputs('Response', response.data)
    return true;
}