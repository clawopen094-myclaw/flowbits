
import { WorkflowTask } from "@/status/WorkflowStatus";
import { ExecutionEnvironment } from "@/types/executor";
import { TaskType } from "@/types/type";
import axios from "axios";

export async function OpenAIExecutor(environment: ExecutionEnvironment<WorkflowTask & { type: TaskType.OpenAI }>): Promise<boolean> {

    const input = environment.getInput('Input')
    const systemInput = environment.getInput('System Message')
    const model = environment.getInput('Model')
    const apiKey = environment.getInput('API Key')
    const stream = environment.getInput('Stream')
    const temperature = environment.getInput('Temperature')

    const response = await axios.post(`${process.env.NEXT_DBU}/api/executephase`, {inputs:{'Input':input,'System Message' : systemInput,'Model':model,'API Key':apiKey,'Stream':stream,'Temperature':temperature},type:TaskType.OpenAI}, {
        headers: { "Content-Type": "application/json" }
    });
    environment.setOutputs('Response', response.data)
    return true;
}