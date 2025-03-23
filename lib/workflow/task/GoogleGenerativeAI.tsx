import { GeminiIcon } from "@/public/icons/GeminiIcon";
import { WorkflowTask } from "@/status/WorkflowStatus";
import { TaskParamType, TaskType } from "@/types/type";
import { LucideProps } from "lucide-react";


export const GoogleGenerativeAI = {
    type: TaskType.GOOGLE_GENERATIVE_AI,
    label: "Google Generative AI",
    icon: (props: LucideProps) => <GeminiIcon size={typeof props.size === 'string' ? parseInt(props.size, 10) : props.size} />,
    description: "Generate text using Google Generative AI.",
    isEntryPoint: true,
    height: 280,
    width: 300,
    credits: 2,
    inputs:[
        {
            name: "Input",
            type: TaskParamType.STRING,
            helperText: "Enter your input string.",
            required: true,
            hideHandel: false,
        },
        {
            name: "System Message",
            type: TaskParamType.STRING,
            helperText: "Enter a system message for the model",
            required: true,
            hideHandel: false,
        },
        {
            name: "Model",
            type: TaskParamType.COMBO_BOX,
            helperText: "Select a model",
            required: true,
            hideHandel: true,
        },
        {
            name: "Stream",
            type: TaskParamType.TOOGLE_INPUT,
            helperText: "Stream the response from the model. Streaming works only in Chat.",
            required: true,
            hideHandel: true,
        },
        {
            name: "API Key",
            type: TaskParamType.VARIABLE_INPUT,
            helperText: "Enter your API Key to use for the Google Generative AI.",
            required: true,
            hideHandel: true,
        },
        {
            name: "Temperature",
            type: TaskParamType.RANGE_SLIDER,
            required: true,
            hideHandel: true,
        },
    ] as const,
    outputs:[
        {
            name: "Response",
            type: TaskParamType.STRING
        }
    ] as const,
    tools: []
} satisfies WorkflowTask




