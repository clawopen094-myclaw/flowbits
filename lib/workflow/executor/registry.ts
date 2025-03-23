import { TaskType } from "@/types/type";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { OpenAIExecutor } from "./OpenAIExecutor";
import { WorkflowTask } from "@/status/WorkflowStatus";
import { ExecutionEnvironment } from "@/types/executor";
import { GoogleGenerativeAIExecutor } from "./GoogleGenerativeAIExecutor";
import { InputExecutor } from "./InputExecutor";


type ExecutorFn<T extends WorkflowTask> = (environment: ExecutionEnvironment<T>)=> Promise<boolean>

type RegistryType = {
    [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>
}

export const ExecutorRegistry: RegistryType = {
    LAUNCH_BROWSER: LaunchBrowserExecutor,
    OpenAI: OpenAIExecutor,
    GOOGLE_GENERATIVE_AI: GoogleGenerativeAIExecutor,
    INPUT: InputExecutor,
}